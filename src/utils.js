const Utils = {
  removeDuplicates: function (array) {
    let tempSet = new Set(array);
    array = [...tempSet];
    return array;
  },
};

export default Utils;
