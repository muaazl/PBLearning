import re
import datetime
from collections import Counter, defaultdict
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from textblob import TextBlob
import pandas as pd
import numpy as np
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors


def load_chat_data(filepath):
    """
    Loads chat data from a text file.
    Assumes each line starts with a date & time and sender.
    Returns a list of dictionaries.
    """
    chat_data = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
           line = line.strip()
           match = re.match(r'[\u200e]*\[(\d{4}-\d{2}-\d{2}, \d{2}:\d{2}:\d{2})\] (.*?): (.*)', line)
           if match:
               date_time_str, sender, message = match.groups()
               date_time_obj = datetime.datetime.strptime(date_time_str, '%Y-%m-%d, %H:%M:%S')
               chat_data.append({'timestamp': date_time_obj, 'sender': sender.strip(), 'message': message.strip()})
           elif re.match(r'.*Messages and calls are end-to-end encrypted.*',line):
               pass #Ignore encrypted message lines
           elif re.match(r'.*created group.*',line):
                pass #Ignore system messages
           elif line.strip() and chat_data and not re.match(r'.*\] .*:',line):
                chat_data[-1]['message'] += '\n' + line.strip()

    return chat_data


def analyze_messages(chat_data, me):
    """Analyzes chat data and returns various metrics."""

    user_messages = Counter()
    user_word_counts = defaultdict(int)
    messages_list = []  # list of message dictionaries for dataframe
    response_times = []
    user_response_times = defaultdict(list)
    
    last_message_time = None
    last_message_sender = None
    
    stop_words = set(stopwords.words('english'))

    for msg in chat_data:
        sender = msg['sender']
        message = msg['message']
        
        user_messages[sender] += 1
        words = [word.lower() for word in message.split() if word.isalpha() and word.lower() not in stop_words]
        user_word_counts[sender] += len(words)

        #Response time calculation
        if 'timestamp' in msg:
          timestamp = msg['timestamp']
          messages_list.append({'timestamp':timestamp,'sender':sender,'message':message})
          if last_message_time and last_message_sender != sender:
              time_diff = (timestamp - last_message_time).total_seconds() / 60  # in minutes
              response_times.append(time_diff)
              user_response_times[sender].append(time_diff)

          last_message_time = timestamp
          last_message_sender = sender
        else:
            messages_list.append({'sender':sender,'message':message})
            
            
    # Data Frame
    messages_df = pd.DataFrame(messages_list)

    # Calculate Words per Message
    words_per_message = {}
    for user, count in user_messages.items():
        if count > 0:
             words_per_message[user] = user_word_counts[user] / count
        else:
            words_per_message[user] = 0 #Avoid division by 0


    #average response time
    avg_response_time = sum(response_times) / len(response_times) if response_times else 0

    avg_user_response_time = {}
    for user, times in user_response_times.items():
       avg_user_response_time[user] = sum(times) / len(times) if times else 0


    # Most used words
    all_words = []
    for msg in chat_data:
        words = [word.lower() for word in message.split() if word.isalpha() and word.lower() not in stop_words]
        all_words.extend(words)

    most_used_words = Counter(all_words).most_common(10)


    # Most Used words by each user
    most_used_words_per_user = {}
    for user in user_messages:
      words = []
      for msg in chat_data:
         if msg['sender'] == user:
            words.extend([word.lower() for word in message.split() if word.isalpha() and word.lower() not in stop_words])
      most_used_words_per_user[user] = Counter(words).most_common(10)

    # Calculate sentiment
    messages_df['sentiment_score'] = messages_df['message'].apply(lambda message: TextBlob(message).sentiment.polarity)

    return {
        'messages_per_user': user_messages,
        'total_words_per_user': user_word_counts,
        'words_per_message': words_per_message,
        'avg_response_time': avg_response_time,
        'avg_user_response_time': avg_user_response_time,
        'most_used_words': most_used_words,
        'most_used_words_per_user' : most_used_words_per_user,
        'messages_df': messages_df
    }

def analyze_sentiment(messages_df, me, other):
        """Analyzes sentiment for various categories."""
        compliments = 0
        criticisms = 0
        red_flags = 0
        green_flags = 0
        
        #Define keywords. You may add/change these to fit your specific context
        compliment_keywords = ["good", "great", "amazing", "wonderful", "nice", "awesome", "beautiful", "fantastic","perfect", "love","like"]
        criticism_keywords = ["bad", "terrible", "awful", "horrible", "disappointing", "annoying", "stupid","idiot", "hate"]
        red_flag_keywords = ["liar", "cheat", "dishonest", "untrustworthy", "gaslight", "manipulate"]
        green_flag_keywords = ["respect", "kind", "caring", "honest", "supportive","loyal", "empathy", "trustworthy"]
        
        for index, row in messages_df.iterrows():
           message = row['message']
           sender = row['sender']
           sentiment_score = row['sentiment_score']

           # Simple sentiment based compliment/criticism detection
           if sentiment_score > 0.5:
               for word in compliment_keywords:
                  if word in message.lower():
                     compliments +=1

           elif sentiment_score < -0.5:
               for word in criticism_keywords:
                   if word in message.lower():
                       criticisms +=1
                       
           #Keyword-based flag detection
           for word in red_flag_keywords:
               if word in message.lower():
                   red_flags += 1
           for word in green_flag_keywords:
               if word in message.lower():
                    green_flags +=1

        
        #Reciprocity Score (very simplified)
        my_messages_count = len(messages_df[messages_df['sender']==me])
        other_messages_count = len(messages_df[messages_df['sender']==other])
        total_messages = my_messages_count + other_messages_count
        if total_messages > 0:
            reciprocity_score =  min(my_messages_count, other_messages_count) / max(my_messages_count, other_messages_count)
        else:
            reciprocity_score = 0

        #Interest level
        if my_messages_count + other_messages_count > 0:
          interest_level = min(my_messages_count, other_messages_count) / (my_messages_count + other_messages_count)
        else:
          interest_level = 0
          
        return {
            'compliments': compliments,
            'criticisms': criticisms,
            'red_flags': red_flags,
            'green_flags': green_flags,
            'reciprocity_score': reciprocity_score,
            'interest_level' : interest_level
        }
        
def analyze_topics(messages_df):
  """ A very simple topic analysis using top words"""
  topic_words = {}
  all_words = []
  stop_words = set(stopwords.words('english'))
  for msg in messages_df['message']:
    words = [word.lower() for word in msg.split() if word.isalpha() and word.lower() not in stop_words]
    all_words.extend(words)
  
  #Basic top words for all chats
  most_common_words = Counter(all_words).most_common(20)
  topic_words['general_topics'] = [word for word, count in most_common_words]
  
  #Optional: You can perform more advanced topic analysis here
  #Examples include LDA, NMF, clustering
  
  return topic_words


def calculate_compatibility(sentiment_data, basic_analysis, me, other):
   """Calculates a very simplified compatibility score"""
   
   #Heuristic-based compatibility score
   score = 0
   
   #Increase score for positive interactions
   score += sentiment_data['compliments'] * 2
   score += sentiment_data['green_flags'] * 1.5

   #Decrease score for negative interactions
   score -= sentiment_data['criticisms'] * 2
   score -= sentiment_data['red_flags'] * 1.5

   #Balance in messages
   score += sentiment_data['reciprocity_score'] * 10

   #Favor short response times
   avg_my_response_time = basic_analysis['avg_user_response_time'].get(me,0)
   avg_other_response_time = basic_analysis['avg_user_response_time'].get(other,0)
   if avg_my_response_time and avg_other_response_time:
     time_diff_score = -abs(avg_my_response_time - avg_other_response_time)  # Penalize large differences
     score += time_diff_score *0.5
   
   #Normalize score to range [0,10] (This is arbitrary and you may change it)
   #I will use max score as sum of all positivite parts to scale the score
   max_score = (sentiment_data['compliments'] * 2) + (sentiment_data['green_flags'] * 1.5) + (sentiment_data['reciprocity_score'] * 10)
   if max_score > 0:
      compatibility_score = min(10, max(0,(score / max_score) * 10 ))  # scale to [0-10]
   else:
       compatibility_score = 5 #default score
   
   return compatibility_score

def suggest_relationship_tips(sentiment_data, basic_analysis, compatibility_score, me, other):
   """Generates relationship tips based on analysis."""
   tips = []
   # Based on sentiment
   if sentiment_data['criticisms'] > sentiment_data['compliments']:
     tips.append("Try to focus on positive communication.")
   if sentiment_data['red_flags'] > 0:
     tips.append("Be aware of potential communication issues.")
   if sentiment_data['interest_level'] < 0.5:
        tips.append('There may be an imbalance of participation, make an effort to be equally engaged')
   
   if compatibility_score < 3:
       tips.append("Communication patterns are not balanced, consider a checkup on what may be the issue.")
   
   if compatibility_score > 8:
       tips.append("Your communication style is very compatible, keep up the positive flow!")

   #Based on response time
   avg_my_response_time = basic_analysis['avg_user_response_time'].get(me,0)
   avg_other_response_time = basic_analysis['avg_user_response_time'].get(other,0)
   if avg_my_response_time and avg_other_response_time:
        if abs(avg_my_response_time - avg_other_response_time) > 60:  #Large difference in response times
             tips.append("Be aware that response time differences can be a source of friction.")
        if avg_my_response_time > 15 and avg_other_response_time > 15:
            tips.append("Consider having conversations in a more real-time medium.")


   # Check for a few affectionates keywords
   affectionate_keywords = ["honey", "babe", "dear", "sweetie","love"]
   my_messages_df = basic_analysis['messages_df'][basic_analysis['messages_df']['sender']==me]
   other_messages_df = basic_analysis['messages_df'][basic_analysis['messages_df']['sender']==other]

   my_affectionate = 0
   other_affectionate = 0

   for message in my_messages_df['message']:
      for word in affectionate_keywords:
         if word in message.lower():
            my_affectionate+=1

   for message in other_messages_df['message']:
      for word in affectionate_keywords:
         if word in message.lower():
            other_affectionate+=1

   if my_affectionate < 3 and other_affectionate < 3:
        tips.append("Consider spicing up conversations with affectionate nicknames.")
   
   if not tips:
        tips.append("Keep up the great communication!")
   return tips
   
def analyze_attachment_style(sentiment_data, basic_analysis, compatibility_score, me, other):
   """Heuristic-based attachment style assessment"""
   attachment_style = "Unclear"
   #Based on sentiment and reciprocity (simplified)
   if sentiment_data['reciprocity_score'] > 0.8 and compatibility_score > 7:
      attachment_style = "Secure"
   elif sentiment_data['reciprocity_score'] < 0.5 and compatibility_score < 5:
        attachment_style = "Anxious or Avoidant"
   else:
      #Further analysis based on sentiment, response times
      avg_my_response_time = basic_analysis['avg_user_response_time'].get(me,0)
      avg_other_response_time = basic_analysis['avg_user_response_time'].get(other,0)
      if avg_my_response_time and avg_other_response_time:
         if abs(avg_my_response_time - avg_other_response_time) > 30 and sentiment_data['interest_level'] < 0.5:
           attachment_style = "Anxious or Avoidant (Possible Imbalance)"
   return attachment_style
    

def main():
    # Get user inputs
    filepath = input("Enter the filepath of the chat file: ")
    me = input("Enter your name as it appears in the chat: ")
    other = input("Enter the other person's name as it appears in the chat: ")

    output_pdf = "chat_analysis.pdf"  # Name for the output PDF

    chat_data = load_chat_data(filepath)
    if not chat_data:
        print("Could not find messages on the selected file. Check your filepath and names.")
        return

    basic_analysis = analyze_messages(chat_data, me)
    messages_df = basic_analysis['messages_df']
    sentiment_data = analyze_sentiment(messages_df, me, other)
    topic_distribution = analyze_topics(messages_df)
    compatibility_score = calculate_compatibility(sentiment_data, basic_analysis, me, other)
    relationship_tips = suggest_relationship_tips(sentiment_data, basic_analysis, compatibility_score, me, other)
    attachment_style = analyze_attachment_style(sentiment_data, basic_analysis, compatibility_score, me, other)

    # Create the PDF document
    doc = SimpleDocTemplate(output_pdf, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle('TitleStyle',
                                 parent=styles['Title'],
                                 fontSize=18,
                                 alignment=1, # Center
                                 spaceAfter=12)
    story.append(Paragraph("Chat Analysis Report", title_style))
    story.append(Spacer(1, 0.2 * inch))


    # Basic Analysis Section
    story.append(Paragraph("<b>----- Basic Analysis -----</b>", styles['h1']))
    story.append(Paragraph(f"Messages per user: {basic_analysis['messages_per_user']}", styles['Normal']))
    story.append(Paragraph(f"Total words per user: {basic_analysis['total_words_per_user']}", styles['Normal']))
    story.append(Paragraph(f"Words per message: {basic_analysis['words_per_message']}", styles['Normal']))
    story.append(Paragraph(f"Average response time: {basic_analysis['avg_response_time']:.2f} minutes", styles['Normal']))
    story.append(Paragraph(f"Average response time per user: {basic_analysis['avg_user_response_time']}", styles['Normal']))
    story.append(Paragraph(f"Most used words: {basic_analysis['most_used_words']}", styles['Normal']))
    story.append(Paragraph(f"Most used words per user: {basic_analysis['most_used_words_per_user']}", styles['Normal']))
    story.append(Spacer(1, 0.2 * inch))



    # Sentiment Analysis Section
    story.append(Paragraph("<b>----- Sentiment Analysis -----</b>", styles['h1']))
    story.append(Paragraph(f"Compliments: {sentiment_data['compliments']}", styles['Normal']))
    story.append(Paragraph(f"Criticisms: {sentiment_data['criticisms']}", styles['Normal']))
    story.append(Paragraph(f"Red flags: {sentiment_data['red_flags']}", styles['Normal']))
    story.append(Paragraph(f"Green flags: {sentiment_data['green_flags']}", styles['Normal']))
    story.append(Paragraph(f"Reciprocity score: {sentiment_data['reciprocity_score']:.2f}", styles['Normal']))
    story.append(Paragraph(f"Interest Level: {sentiment_data['interest_level']:.2f}", styles['Normal']))
    story.append(Spacer(1, 0.2 * inch))


    # Relationship Analysis Section
    story.append(Paragraph("<b>----- Relationship Analysis -----</b>", styles['h1']))
    story.append(Paragraph(f"Compatibility score: {compatibility_score:.2f}/10", styles['Normal']))

    tips_text = "<br/>".join(relationship_tips)  # Format list as a bulleted list
    story.append(Paragraph(f"Relationship Tips:<br/>{tips_text}", styles['Normal']))
    story.append(Paragraph(f"Attachment Style: {attachment_style}", styles['Normal']))
    story.append(Spacer(1, 0.2 * inch))


    # Topic Distribution Section
    story.append(Paragraph("<b>----- Topic Distribution -----</b>", styles['h1']))
    story.append(Paragraph(f"General Topics: {topic_distribution.get('general_topics', 'No topics found')}", styles['Normal']))
    story.append(Spacer(1, 0.2 * inch))

    # Build the PDF
    doc.build(story)

    print(f"PDF report generated successfully: {output_pdf}")


if __name__ == "__main__":
    main()