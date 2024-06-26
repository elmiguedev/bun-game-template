import type { Socket } from "socket.io";
import type { PlayerMoveAction } from "../../../core/actions/PlayerMoveAction";

export const PlayerMoveHandler = (socket: Socket, action: PlayerMoveAction) => {
  return {
    handle: (direction: string) => {
      return action.execute(socket.id, direction)
    }
  }
}