module.exports = {
  dataConverter(data) {
    let output = undefined;
    
    try {
      output = JSON.parse(data);
    } catch(err) {
      if (isNaN(data) == false) output = Number(output);
      else output = data;
    }
    
    return output;
  },
  childSet(keys, data, oldData) {
    let isObject = false;
    
    let output = "oldData";

    try {
      oldData = JSON.parse(oldData);
      isObject = true;
    } catch(err) {
      if (typeof oldData == "object") isObject = true;
      else isObject = false;
    }
    
    if (isObject) {
      data = Array.isArray(data) ? data : typeof data == "object" ? Object.entries(data).reduce((acc, val) => {
        if (val[1].length == 0 && !Array.isArray(val[1])) return;
        
        return { ...acc, [val[0]]: val[1] }
      }, {}) : data;
      
      keys.slice(1).forEach((key, i, arr) => {
        if (!eval(output).hasOwnProperty(key)) {
          output += `["${key}"]`;
          
          eval(`${output} = {}`);
        }
        else output += `["${key}"]`; 
        
        if (arr.length == i + 1) output += `= ${JSON.stringify(data)}`;
      });
      eval(output)
    
      return oldData;
    } else return undefined;
  },
  childGet(keys, data) {
    if (typeof data != "object" || Array.isArray(data)) return undefined;
    
    let isObject = true;
    
    keys.slice(1).forEach((key) => {
      if (data.hasOwnProperty(key)) {
        isObject = true;
        
        data = data[key];
      } else isObject = false;
    });
    
    return isObject ? data : undefined;
  },
  childDelete(keys, oldData) {
    let data = oldData
    let newObj = '';
    
    keys.forEach(altKey => {
      if (newObj.length === 0) {
        newObj += "delete data"
      } else {
        newObj += `["${altKey}"]`
      }
    })
    eval(newObj)
    
    return data;
  },
  arrFilter(array, filter) {
    if (!array || !Array.isArray(array) || !filter || Array.isArray(filter)) return;
    filter = typeof filter == "object" ? Object.entries(filter) : filter;
    let output = [];
    
    if (Array.isArray(filter)) {
      output = array.map((val, i) => {
        if (typeof val != "object" || Array.isArray(val)) return {};
        
        return { 
          target: val, 
          is: (
            filter.map((_val) => val[_val[0]] == _val[1])
          ),
          index: i 
        }
      });
      
      output = output.filter((val) => {
        if (val.hasOwnProperty("is")) return (
          val.is.length == val.is.filter((_val) => _val).length
        );
        else val;
      }).flat();
      
      output = array.filter((val, i) => {
        return !output.some((_val) => _val.index == i)
      });
    } else output = array.filter((val) => val != filter);
    
    return output;
  }
};
