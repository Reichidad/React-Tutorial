import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let name = "square" + (props.highlight ? '-highlight' : '')
    return (
        <button className={name} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={this.props.highlight.includes(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {[0, 1, 2].map((n) => this.renderSquare(n))}
                </div>
                <div className="board-row">
                    {[3, 4, 5].map((n) => this.renderSquare(n))}
                </div>
                <div className="board-row">
                    {[6, 7, 8].map((n) => this.renderSquare(n))}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    clicked: null
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            isDesc: false
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const symbol = this.state.xIsNext ? "X" : "O";
        const lastEvent = symbol + ' clicked (' + parseInt(i / 3) + ', ' + i % 3 + ')';
        if (calculateWinner(squares).winPlayer || squares[i]) {
            return;
        }
        squares[i] = symbol;
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    clicked: lastEvent
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }
    changeOrder() {
        this.setState({
            isDesc: !this.state.isDesc
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const isDesc = this.state.isDesc;

        let moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ', ' + history[move].clicked :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        style={{ 'fontWeight': this.state.stepNumber === move ? 'bold' : 'normal' }}
                        onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        });

        if (isDesc) {
            moves = moves.reverse();
        }

        let status;
        if (winner.winPlayer) {
            status = "Winner: " + winner.winPlayer;
        } else {
            if (this.state.stepNumber === 9) {
                status = "Draw"
            } else {
                status = "Next player: " + (this.state.xIsNext ? "X" : "O");
            }

        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        highlight={winner.winnerSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{'current order : ' + (this.state.isDesc ? 'DESC' : 'ASC')}</div>
                    <button
                        onClick={() => this.changeOrder()}>
                        {'change order to ' + (this.state.isDesc ? 'ASC' : 'DESC')}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winPlayer: squares[a],
                winnerSquares: lines[i]
            }
        }
    }
    return {
        winPlayer: null,
        winnerSquares: []
    }
}
