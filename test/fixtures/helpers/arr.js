module.exports =  [
  'test/fixtures/helpers/two.js',
  {
    foo: function () {
      return 'hi';
    }
  },
  function () {
    return {
      foo: function () {
        return 'hi';
      }
    }
  },
  [
    'test/fixtures/helpers/three.js',
    {
      bar: function () {
        return 'hi';
      }
    },
    function () {
      return {
        bar: function () {
          return 'hi';
        }
      }
    },
  ]
];