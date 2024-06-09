import { Player } from "../entities/Player";
import io, { Socket } from "socket.io-client";

export class GameScene extends Phaser.Scene {
  private socket!: Socket;
  private controls!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player: Player;
  private players: Record<string, Player> = {};

  constructor() {
    super("GameScene");
  }

  create() {
    this.controls = this.input.keyboard.createCursorKeys();
    this.socket = io();

    this.socket.on("player_disconnected", (id: string) => {
      const player = this.players[id];
      if (player) {
        player.destroy();
        delete this.players[id];
      }
    });

    this.socket.on("game_state", (state: any) => {
      Object.keys(state).forEach((playerId: string) => {
        const playerState = state[playerId];
        if (playerState.id === this.socket.id) {
          if (this.player) {
            this.player.setPosition(playerState.x, playerState.y);
          } else {
            console.log("Creando player principal", playerState);
            this.player = new Player(this, playerState.x, playerState.y);
          }
        } else {
          if (this.players[playerState.id]) {
            this.players[playerState.id].setPosition(playerState.x, playerState.y);
          } else {
            console.log("Creando enemigo", playerState, this.socket.id,);
            this.players[playerState.id] = new Player(this, playerState.x, playerState.y);
          }
        }
      })
    });

  }

  update() {
    if (this.player) {
      if (this.controls.left.isDown) {
        this.socket.emit("move", "left");
      }
      if (this.controls.right.isDown) {
        this.socket.emit("move", "right");
      }
      if (this.controls.up.isDown) {
        this.socket.emit("move", "up");
      }
      if (this.controls.down.isDown) {
        this.socket.emit("move", "down");
      }
    }
  }
}