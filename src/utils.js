const Utils = {
  removeDuplicates: function (array) {
    let tempSet = new Set(array);
    array = [...tempSet];
    return array;
  },
  getCircularReplacer: function () {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  },
};

export default Utils;
