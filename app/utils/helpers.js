const checkCache = (timeStamp, loader, elapsedSeconds = 60) => {
  const now = new Date().getTime();
  const elapsedTime = now - timeStamp;
  if(elapsedTime > elapsedSeconds * 1000) {
    console.log("CACHE INVALIDATED CALLING LOADER");
    return loader();
  } else {
    console.log("DATA IN CACHE NOT CALLING LOADER");
    return Promise.resolve();
  }
}

const unique = arr => {
    return arr.reduce((memo, value, arr) => {
        return memo.indexOf(value) === -1
            ? memo : memo.concat(value);
    }, []);
}

const parseStatus = status => status === 'qualify-candidate' ? 'Completed' : 'Chat In Progress'

const progress = progressObj => {
    const { dateChatted, dateApplied, chatStatus, dateInvited} = progressObj;
    const engageStatus = chatStatus !== "no-status" ? parseStatus(chatStatus)
    /* : dateChatted ? 'Chatted'*/
              : dateInvited ? 'Invited': 'Applied';
    const progress = engageStatus === 'Applied' ? 1
              : engageStatus === 'Invited' ? 50 : 100;
    /* : engageStatus === 'Chatted' ? 66 : 100;*/
    return {
        statusType: engageStatus,
        progress: progress
    }
}


export {
  unique,
  checkCache,
  progress
}
