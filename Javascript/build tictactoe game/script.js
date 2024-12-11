const TicTac = {
    cPlayer: "X",
    state: Array(9).fill(null),
    gameOver: false,
}

TicTac.init = function () {
    this.cBoard()
    document.getElementById("reset").addEventListener("click", () => this.reset())
    console.log(this.state)
}

TicTac.cBoard = function () {
    const board = document.getElementById("board")
    board.innerHTML = ""
    this.state.forEach((_, i) => {
        const cell = document.createElement("div")
            cell.classList.add("cell")
            cell.dataset.index = i
            board.appendChild(cell)
    })
    board.replaceWith(board.cloneNode(true))
    document.getElementById("board").addEventListener("click", (e) => this.handleClick(e))
}

TicTac.handleClick = function (e) {
    const cell = e.target
    const i = cell.dataset.index

    if (this.gameOver || !cell.classList.contains("cell") || this.state[i]) return 

    this.state[i] = this.cPlayer
    cell.textContent = this.cPlayer
    cell.classList.add("taken")

    const winCombo = this.checkWin()
    if (winCombo) {
        this.gameOver = true
        this.uMessage(`Player ${this.cPlayer} wins!`)
    } else if (this.state.every((cell) => cell)) {
        this.gameOver = true
        this.uMessage("It's a tie!")
    } else {
        this.cPlayer = this.cPlayer === "X" ? "O" : "X"
        this.uMessage(`Player ${this.cPlayer}'s turn`)
    }
}

TicTac.checkWin = function () {
    const wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    return wins.find((combo) =>
        combo.every((i) => this.state[i] === this.cPlayer)
    )
}

TicTac.reset = function () {
    this.state = Array(9).fill(null)
    this.cPlayer = "X"
    this.gameOver = false
    this.cBoard()
    this.uMessage(`Player ${this.cPlayer}'s turn`)
}

TicTac.uMessage = function (msg) {
    document.getElementById("message").textContent = msg
}

TicTac.init();