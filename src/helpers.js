const helpers = {
  capitalize: function(s) {
    if (typeof s !== "string") return "";
    return s
      .toLowerCase()
      .split(" ")
      .map(name => name.charAt(0).toUpperCase() + name.slice(1))
      .join(" ");
  },
  formatDate: function(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
};

export default helpers;
