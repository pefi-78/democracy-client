import repository from './Schema';

import Model from './Model';

const VoteService = {
  findAll: () => {
    return repository.objects('Vote');
  },

  findByProcedureId: procedureId => {
    const votes = repository.objects('Vote').filtered(`procedureId = "${procedureId}"`);
    if (votes && votes[0]) {
      return votes[0];
    }
    return null;
  },

  save: vote => {
    repository.write(() => {
      vote.votedAt = new Date();
      repository.create('Vote', vote);
    });
  },

  update: (vote, callback) => {
    if (!callback) return;
    repository.write(() => {
      callback();
      vote.updatedAt = new Date();
    });
  },
};

export default VoteService;
export { Model };
