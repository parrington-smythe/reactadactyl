import React from 'react';
import './game.css';

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function Square(props) {
    return (
        <button className="square" onClick={props.onBumhole}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square value={this.props.squares[i]} onBumhole={() => this.props.onButtocks(i)} />;
    }

    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            clicks: 0,
            xIsNext: true,
            stepNumber: 0
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : '0';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            clicks:  this.state.clicks + 1,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            counter: 0
        });
    }

    replayGame() {
        this.jumpTo(0);
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    tick() {
        const historyLength = this.state.history.length;
        const counter = this.state.counter;

        if (counter < historyLength) {
            this.jumpTo(counter);
        } else {
            this.stopTimer();
        }
    }

    stopTimer() {
        clearInterval(this.timerID);
        this.setState({
            counter: 0
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            clicks: step,
            xIsNext: (step % 2) === 0,
            counter: this.state.counter + 1
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        const replayButton = <li><button onClick={() => this.replayGame()}>Replay Game</button></li>
        let status, statusPlus;
        if (winner) {
            status = 'Winner is: ' + winner;
            statusPlus = replayButton;
        } else if (this.state.clicks === 9) {
            status = 'No More Moves';
            statusPlus = replayButton;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onButtocks={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}{statusPlus}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

export default Game;