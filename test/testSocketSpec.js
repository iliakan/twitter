// e2e not working
define(["socket"], function(socket) {

  describe('socket', function() {
    it('should have session', function() {

      console.log(socket.status);

      socket.once('session', function() {
        console.log("111", socket.session);
        expect(socket.session).to.be.ok;
      });

    });

  });
});

