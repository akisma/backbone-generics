define(
  [
    'app',
    'underscore'
  ],
  function(app, _){
    return {
      hash: {
        //type : message formula
        'general':                  '{{= message }}',
        //login and account creation
        'NotFound':                 {
                                      'User':         'The username and password provided do not match any credentials in our database. Please check the spelling and try again.',
                                      'CreditCard':   'You do not have a credit card associated with your account.',
                                      'AccessToken':  'Your access token is invalid, so you are being logged out. Please log in again.',
                                    },

        'AlreadyExists':            {
                                      'user':  'User already exists.',
                                      'Facility': 'That facility name already exists. Please choose another.'
                                    },

        'WrongPassword':            'Your original password is wrong. Please double check and try again.',
        'EmailDeliveryError':       'Our system was unable to send an email to the address provided. Please check that it is valid and that your mailbox is not full.',

        //facebook
        'FacebookTokenFail':        'We couldn\'t save your Facebook settings. Please try again.',
        'FacebookNoAuth':           'User cancelled login or did not fully authorize.',

        //image errors
        'UnknownImageError':        'We couldn\'t upload your image, sorry. Please try again and check the size and dimension guidelines.',
        'FileUploadTooLarge':       'File size must not exceed 700kb.',

        //input validation
        'MissingParameter':         'The <%= param %> field is required.',
        'InvalidType':              'value is of type <%= is %> but <%= expected %> was expected',
        'InvalidLength':            'length must be between <%= min %> and <%= max %>',
        'InvalidEmail':             '<%= email %>  is not a valid email',

        //global errors
        'APIDown':                  'We couldn\'t connect to our API. Please check your connection and try again.',
        'UnknownFailure':           'We couldn\'t load your data. Please refresh the page and try again.',
        'UnknownError':             'We\'ve encountered an unknown error. Please refresh the page and try again.',
        'InvalidValue':             '<%= param %>: <%= message %>', //this mapping won't work, too many options (lower case, upper case, too high, too low, etc)
        'InvalidLength':            '<%= param %> must be between <%= min %> and <%= max %> characters.',

        //credit card
        'CardNumberInvalid':        'The credit card number you have entered is invalid.',
        'CardCVCInvalid':           'The credit card cvc you have entered is invalid.',
        'CardExpiryInvalid':        'The credit card expiration date you have entered is invalid'
      },

      //todo - needs to be double keyed hash, because the entity matters for which message it maps to

      //##_getErrorText
      //obtain error text from internal hash
      _getErrorText: function(error){
        var val = ('entity' in error) ? this.hash[error.type][error.entity] : this.hash[error.type];

        if (!('type' in error)){
          val = error.message;
        }

        return (typeof val != 'undefined') ? val : 'An unknown error occurred.';
      },

      //##_replaceErrorText
      //use this to parse the error string with the args passed in
      _replaceErrorText: function(error, formula){
        //parse the formula with the error object based on type
        //run through lodash in case there are vars
        var template = _.template(formula);
        return template(error);
      },

      //##issueError
      //display an error alert
      //todo: make this emit an error event to greylog/middleware when ready
      //args
      //either data.error or data.errors must be included
      //{
        //errors: [],
        //error: {}
      //}
      //error objects look like:
      //{
      //  type: 'stringToMatchHashAbove' || other
      //  message: '', if custom message, otherwise this is generally ignored
      //  param: (optional) parameter with error
      //  other attrbs like min, max, etc that come from assurance have been integrated into error messaging, please refer to that documentation
      //}
      issueError: function(data){
        var message = '',
            errorFromHash;

        //multiple, from assurance object
        if ('errors' in data){
          for (var i = 0; i < data.errors.length; i++){
            if (i > 0){
              message += '<br />';
            }
            message += this.getError(data.errors[i]);
          }
        } else {
        //single, regular path
          errorFromHash = this.getError(data);
          message = (errorFromHash) ? errorFromHash : data.error.message;
        }

        //example messenger - posts a global notification. choose your own.
        // require(['messenger'], function(Messenger){
        //   Messenger().post({ message: message });
        // });

      },

      //todo add precompilation
      templates: {},

      //##getError
      //made for custom handlers in case they need something special and just want the text
      getError: function(error){
        var formula = this._getErrorText(error);
        return this._replaceErrorText(error, formula);
      }
    };
  }
);