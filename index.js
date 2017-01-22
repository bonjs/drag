

var Block = function() {
	// this.currentPosition	// 当前位置
	// this.position	// 原来的位置（格子）
	
}

Block.prototype = {
	shake: function() {	// 振动
	
		this.interval = setInterval(function() {
			var left = this.position.left;
			var top = this.position.top;
			this.el.animate({
				left: left + 2,
			}, 100);
			this.el.animate({
				left: left - 2 
			}, 100);
		}.bind(this));
	},
	stopShake: function() {
		this.el.stop(true);
		clearInterval(this.interval);
	}
}


var Main = function() {
	var me = this;
	
	var offset 	= $('.draggable').offset().left;	// 图标外边界
	var width 	= $('.draggable').width();			// 图标边长

	var draggable = $('.draggable').draggabilly();
	
	this.blocks = [];
	
	var animateTime = 150;
	
	var tag = false;
	
	draggable.each(function(i, blockEl) {
		
		var block = new Block();
		block.position = $(blockEl).position();
		block.currentPosition = $(blockEl).position();
		
		block.el = $(blockEl);
		$(blockEl).data('block', block);
		
		me.blocks.push(block);
	});
	draggable.on('dragMove', function(e, pointer, moveVector ) {
		
		var currentBlock = $(this).data('block');	// 当前block
		currentBlock.currentPosition = $(this).position();
		
		var nearestBlockExt = me.getNearestBlock(currentBlock);
		nearestBlockExt.currentPosition = $(this).position();	// 同步当前位置
		$(this).css('z-index', '3');
		var el = nearestBlockExt.block.el;
		if (nearestBlockExt.distance > 50) { // 如果距离大于50, 则回到原来位置
			el.css({
				'z-index': 'auto',
				'border': '2px white solid'
			});
			el.css('z-index', 'auto');
			tag && nearestBlockExt.block.stopShake();
			
			tag = false;
		} else {
			tag || nearestBlockExt.block.shake();
			
			tag = true;
			el.css({
				'z-index': '2',
				'border': '2px #36ab7a dashed'
			});
		}
	}).on('dragEnd', function(e, pointer) {
		
		var currentBlock = $(this).data('block');	// 当前block
		var nearestBlockExt = me.getNearestBlock(currentBlock);			// 获取距当前最近的block
		
		nearestBlockExt.block.stopShake();
		nearestBlockExt.block.el.stop(true);
		
		if(nearestBlockExt.distance > 50) {	// 如果距离大于50, 则回到原来位置
			$(this).animate(currentBlock.position, animateTime, function() {
				$(this).css('z-index', 'auto');
			});
		} else {
			nearestBlockExt.block.el.animate(currentBlock.position, animateTime, function() {
				$(this).css('z-index', 'auto');
			}); // 最近的block(也是目标)移动到currentBlock原来的位置(position)
			
			$(this).animate(nearestBlockExt.block.position, animateTime, function() {
				$(this).css('z-index', 'auto');
			});	// 当前block移动到目标block的原来的位置position
			
			// 位置交换后，交换position的值
			var tempPosition = nearestBlockExt.block.position;
			nearestBlockExt.block.position = currentBlock.position;
			currentBlock.position = tempPosition;			
		}
		nearestBlockExt.block.el.css('border', '2px white solid');
		
	}).on('pointerDown', function(event, pointer) {
		//$(this).parent().css({border: '1px red dashed'})
	}).on('pointerUp', function(event, pointer) {
		//$(this).parent().css({border: '1px white dashed'})
		
	});	
}


Main.prototype = {

	getNearestBlock : function(block) {
		var me = this;
		var currentPosition = block.currentPosition;
		
		return this.blocks.reduce(function(o, it, i) {
			var distance = o.distance;
			var index = o.index;
			
			var dis = me.getDistance(currentPosition, it.position);	// 当前block和目标block的位置距离
			if(block != it && distance > dis) {
				distance = dis;
				index = i;
			}
			return {
				index: index,
				distance: distance,
				block: me.blocks[index]
			}
		}, {
			index: -1,
			distance: Number.MAX_VALUE
		});
	},
	getDistance : function(p1, p2) {
		return Math.sqrt(Math.pow(p2.left - p1.left, 2) + Math.pow(p2.top - p1.top, 2));
	},
	movoTo: function(position, time) {
		
	}
}

new Main();