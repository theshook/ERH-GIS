import { Index, MinimongoEngine  } from 'meteor/easy:search';

checkString = function (data) {
  return data.trim() == '';
}

clearString = function (data) {
  return data='';
}

////////////////////////////////////////////
//  Easy Search
////////////////////////////////////////////
// Users = new Mongo.Collection('users');
UsersIndex = new Index({
  engine: new MinimongoEngine ({
    sort: function() {
      return { createdAt: -1 };
    },
    selector: function(searchObject, options, aggregation) {
      let selector = this.defaultConfiguration().selector(searchObject, options, aggregation),
      categoryFilter = options.search.props.categoryFilter;

      if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
        selector.category = categoryFilter;
      }

      return selector;
    }
  }),
  collection: Meteor.users,
  fields: ['emails.address', 'profile.lname', 'profile.fname', 'profile.local'],
  defaultSearchOptions: {
    limit: 7
  },
  permission: () => {
    return true;
  }
});
