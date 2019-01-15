import { DECISIONS } from './Schema';

class VotesModel {
  constructor({ procedureId, decision, constituency, votedAt }) {
    if (!DECISIONS.includes(decision)) {
      throw new Error('decision does not extist!');
    }
    this.procedureId = procedureId;
    this.decision = decision;
    this.constituency = constituency || null;
    this.votedAt = votedAt || new Date();
  }
}

module.exports = VotesModel;
