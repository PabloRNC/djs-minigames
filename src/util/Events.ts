/* eslint-disable linebreak-style */
import { TicTacToe } from '../structures/TicTacToe'

export type Events  = {
    tictactoeEnd: (tictactoe: TicTacToe) => void
}