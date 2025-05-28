export class StateMachine {
  constructor() { this.state = null; }

  change(nuevoEstado) {
    if (this.state && this.state.exit) this.state.exit();
    this.state = nuevoEstado;
    if (this.state.enter) this.state.enter();
  }

  update(dt)  { if (this.state && this.state.update)  this.state.update(dt);  }
  draw(canvas, ctx)   { if (this.state && this.state.draw)    this.state.draw(canvas, ctx);   }
  input(e)    { if (this.state && this.state.input)   this.state.input(e);    }
}
