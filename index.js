/*
	10 10
	10 + 10 + 10 + 100 10
	10 + 10 + 10 + 10 + 10 + 100 10
	10 + 10 + 10 + 10 + 10 + 10 + 10 + 100 10

	10 10 + 10 + 10 + 100
	10 + 10 + 10 + 100 10 + 10 + 10 + 100

	10 + 20 * n + 100 * n
*/

var Block = function() {
	
	
}
Block.prototype = {
	
	
}


var Main = function() {
	var me = this;
	
	var offset 	= $('.draggable').offset().left;	// ͼ����߽�
	var width 	= $('.draggable').width();			// ͼ��߳�

	var draggable = $('.draggable').draggabilly();
	
	this.blocks = [];
	
	draggable.each(function(i, d) {
		
		var block = new Block();
		block.position = $(d).position();
		
		me.blocks.push(block)
		
		//$(d).data('initPosition', $(d).position());
	});
	draggable.on('dragMove', function(event, pointer, moveVector ) {
		
		var currentIndex = $(this).parent().index();
		var currentBlock = me.blocks[currentIndex];	// ��ǰblock
		var b = me.getNearestBlock(currentBlock);
	}).on('dragEnd', function() {
		var currentIndex = $(this).parent().index();
		var currentBlock = me.blocks[currentIndex];	// ��ǰblock
		var b = me.getNearestBlock(currentBlock);			// ��ȡ�൱ǰ�����block
		
		if(b.distance > 50) {	// ����������50, ��ص�ԭ��λ��
			//$(this).animate($(this).data('initPosition'), 200);
			$(this).animate(currentBlock.position, 200);
		} else {
			b.animate(currentBlock.position, 200);
			
			$(this).animate(b.position, 200);
			
			setTimeout(function() {
				
				//var p1 = $(this).parent();
				//var p2 = $('.draggable').eq(b.index).parent();
				//p2.append($(this));
				//p1.append($('.draggable').eq(b.index));
				
				var tempLeft, tempTop;
				tempLeft = b.position.left;
				tempTop	 = b.position.top;
				
				b.position = {
					left: currentBlock.left,
					top: currentBlock.top
				};
				currentBlock.position = {
					left: tempLeft,
					top: tempTop
				};
				
			}.bind(this));
		}
	}).on('pointerDown', function(event, pointer) {
		//$(this).parent().css({border: '1px red dashed'})
	}).on('pointerUp', function(event, pointer) {
		//$(this).parent().css({border: '1px white dashed'})
		
	});
	
	
}


Main.prototype = {

	getNearestBlock : function(block) {
		var me = this;
		var blockPos = block.position;
		
		return this.blocks.reduce(function(o, it, i) {
			var distance = o.distance;
			var index = o.index;
			
			var dis = me.getDistance(blockPos, it.position);
			if(block != it && distance > dis) {
				distance = dis;
				index = i;
			}
			return {
				index: index,
				distance: distance
			}
		}, {
			index: -1,
			distance: Number.MAX_VALUE
		});
	},
	getDistance : function(p1, p2) {
		return Math.sqrt(Math.pow(p2.left - p1.left, 2) + Math.pow(p2.top - p1.top, 2));
	},
	
	moveTo: function(draggable, position) {
		draggable.animate({
			left: position.x,
			top: position.y
		}, 200);
	},
	getPositionByIndex: function(x, y) {
		function m(n) {
			var p = offset + offset * 2 * n + width * n;
			console.log(p)
			return p;
		}
		return {
			x: m(x),
			y: m(y)
		};
	}
}

new Main();