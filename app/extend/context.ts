const tran = Symbol('Context#tran');
module.exports = {
  async tran() {
    if (!this[tran]) {
      this[tran] = await this.app.model.transaction()
    }
    return this[tran]
  },
  getTran() {
    return this[tran]
  }
};