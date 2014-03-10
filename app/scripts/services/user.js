'use strict';
/*jshint camelcase: true */

app.factory('User', function($firebase, FIREBASE_URL, $rootScope){
	var ref = new Firebase(FIREBASE_URL + 'users');

	var users = $firebase(ref);

	$rootScope.$on('$firebaseSimpleLogin:login', function(e, authUser){
		var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid));

		query.$on('loaded', function (){
			setCurrentUser(query.$getIndex()[0]);
		});
	});

	$rootScope.$on('$firebaseSimpleLogin:logout', function(){
		delete $rootScope.currentUser;
	});

	var User = {
		create : function(authUser, userName){
			users[userName] = {
				/*jshint camelcase: false */
				md5_hash: authUser.md5_hash,
				userName: userName,
				$priority: authUser.uid
			};

			users.$save(userName).then(function(){
				setCurrentUser(userName);
			});
		},
		findByUserName : function(userName){
			if(userName){
				return users.$child(userName);
			}
		},
		getCurrent : function(){
			return $rootScope.currentUser;
		},
		signedIn : function(){
			return $rootScope.currentUser !== undefined;
		}
	};

	function setCurrentUser(userName){
		$rootScope.currentUser = User.findByUserName(userName);
	}

	return User;
});