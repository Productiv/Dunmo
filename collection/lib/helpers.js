
var durationFields = ['timeSpent', 'timeRemaining'];

fieldsToMilliseconds = function(doc) {
  if(!doc) return null;
  durationFields.forEach(function(attr) {
    if(typeof doc[attr] === 'object') {
      doc[attr] = doc[attr].toMilliseconds();
    }
  });
  return doc;
};

fieldsToDuration = function(doc) {
  if(!doc) return null;
  durationFields.forEach(function(attr) {
    if(typeof doc[attr] === 'number') {
      doc[attr] = new Duration(doc[attr]);
    }
  });
  return doc;
};
