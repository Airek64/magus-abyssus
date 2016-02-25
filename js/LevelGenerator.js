BasicGame.LevelGenerator = function(game) {
    
    this.game = game;
    this.groundTiles = null;
    this.wallTiles = null;
    this.rooms = [];
    this.startingTile = null;
    this.exitTile = null;
    this.enemies = [];
}

BasicGame.LevelGenerator.prototype = {
 
    generate: function() {
        this.groundTiles = this.game.add.group();
        this.wallTiles = this.game.add.group();
        this.room = this.game.add.group();
        
        for (var i = 0; i < this.game.rnd.integerInRange(4,8); i++){
            var room = new BasicGame.Room(this.game);
            var width = this.game.rnd.integerInRange(4,12);
            var height = this.game.rnd.integerInRange(4,12);
            room.add(this.game.rnd.integerInRange(0,32) * 64, this.game.rnd.integerInRange(0,32) * 64, width, height);
            this.groundTiles.addMultiple(room.groundTiles);
            this.wallTiles.addMultiple(room.wallTiles);
            this.rooms[i] = room;
        }
        
        //find placements for things
        
        this.startingTile = this.groundTiles.getChildAt(this.game.rnd.integerInRange(0,this.groundTiles.length - 1));
        this.exitTile = this.groundTiles.getChildAt(this.game.rnd.integerInRange(0,this.groundTiles.length - 1));
        
        //this.placeEnemies();
        
        for (var i = 0; i < this.rooms.length; i++){
            //var requiredConnections = this.game.rnd.integerInRange(1,2);
            var room1 = this.rooms[i];
            //while (room1.connections < requiredConnections){
                var room2;
                if (i == this.rooms.length -1){
                    room2 = this.rooms[0];
                } else {
                    room2 = this.rooms[i + 1];
                }
                this.drawPassage(room1, room2);
                room1.connections++;
                room2.connections++;
                
                
            //}
        }
        
    },
    
    placePlayer: function(player) {
        player.sprite.x = this.startingTile.x;
        player.sprite.y = this.startingTile.y;
    },
    
    placePortal: function(portal) {
        portal.x = this.exitTile.x;
        portal.y = this.exitTile.y;
    },
    
    placeEnemies: function() {
        for (var i = 0; i < 5; i++){
            this.enemies[i] = new BasicGame.Rat(this.game);
            var tile = this.groundTiles.getChildAt(this.game.rnd.integerInRange(0,this.groundTiles.length - 1));
            this.enemies[i].add(tile.x,tile.y);
        }
        return this.enemies;
    },
    
    drawPassage: function(room1, room2){
        var startX = Math.round(room1.x + room1.width / 64) + this.game.rnd.integerInRange(1, room1.width /2) * 64;
        var startY = Math.round(room1.y + room1.height / 64) + this.game.rnd.integerInRange(1, room1.height /2) * 64;
        var endX = Math.round(room2.x + room2.width / 64) + this.game.rnd.integerInRange(1, room2.width /2) * 64;
        var endY = Math.round(room2.y + room2.height / 64) + this.game.rnd.integerInRange(1, room2.height /2 ) * 64;
        
        if (startX > endX){
            var temp = startX;
            startX = endX;
            endX = temp;
        }
        
        if (startY > endY){
            var temp = startY;
            startY = endY;
            endY = temp;
        }
        
        var initialDir = this.game.rnd.integerInRange(0, 1);
        
        var tile;
        
        if (initialDir == 0){
            for (var i = startX; i < endX; i += 64){
                tile = this.groundTiles.create(i, startY, 'ground');
                tile.anchor.set(0.5,0.5);
            }
            for (var i = startY; i < endY; i += 64){
                tile = this.groundTiles.create(endX, i, 'ground');
                tile.anchor.set(0.5,0.5);
            }
        }
        else if (initialDir == 1){
            for (var i = startY; i < endY; i += 64){
                tile = this.groundTiles.create(startX, i, 'ground');
                tile.anchor.set(0.5,0.5);
            }
            for (var i = startX; i < endX; i += 64){
                tile = this.groundTiles.create(i, endY, 'ground');
                tile.anchor.set(0.5,0.5);
            }
        }
        
        
        
    }
    
}

BasicGame.Room = function(game) {
    this.game = game;
    this.groundTiles = null;
    this.wallTiles = null;
    this.x;
    this.y;
    this.width;
    this.height;
    this.connections = null;
    //this.tiles = null;
}

BasicGame.Room.prototype = {
    
    add: function(x, y, width, height) {
        
        var wall;
        var ground;
        
        this.connections = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.groundTiles = this.game.add.group();
        this.wallTiles = this.game.add.group();
        
        
        for (var i = 0; i < width; i++){
            wall = this.wallTiles.create(i * 64 + x, y, 'wall');
            wall.anchor.set(0.5, 0.5);
        }
        
        for (var i = 0; i < width; i++){
            wall = this.wallTiles.create(i * 64 + x, (height - 1)  * 64 + y, 'wall');
            wall.anchor.set(0.5, 0.5);
        }
        
        for (var i = 1; i < height - 1; i++){
            wall = this.wallTiles.create(x, i * 64 + y, 'wall');
            wall.anchor.set(0.5, 0.5);
        }
        
        for (var i = 1; i < height - 1; i++){
            wall = this.wallTiles.create((width -1) * 64 + x, i * 64 + y, 'wall');
            wall.anchor.set(0.5, 0.5);
        }
        for (var i = 1; i < height - 1; i++){
            for (var j = 1; j < width -1; j++){
                ground = this.groundTiles.create(j * 64 + x, i * 64 + y, 'ground');
                ground.anchor.set(0.5, 0.5);
            }
        }
    },
    
    setPosition: function (x, y) {
        this.wallTiles.x = x;
        this.wallTiles.y = y;
        this.groundTiles.x = x;
        this.groundTiles.y = y;
    },
    
    moveTile: function(tile, x, y) {
        tile.x += x;
        tile.y += y;
    }
    
}