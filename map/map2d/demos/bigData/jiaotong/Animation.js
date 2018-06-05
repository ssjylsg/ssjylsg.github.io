(function(window, undefined) {
	'use strict';

	var animation = function Animation(options) {
		this.opts = options || {};
		this.flag = !0;
		var that = this;

		void 0 !== this.opts.from && void 0 !== this.opts.to && (
			this.index = options.from,

			requestAnimationFrame(function() {
				that.circulate();
			})
		)
	};

	animation.prototype.circulate = function() {
		if (this.flag) {
			var t = this;
			this.opts.to > this.opts.from && this.index < this.opts.to || this.opts.to < this.opts.from && this.index > this.opts.to ? (this.opts.action && this.opts.action(this.index), setTimeout(function() {
					requestAnimationFrame(function() {
						t.circulate();
					})
				},
				this.opts.fps ? 1e3 / this.opts.fps : 0), this.opts.to > this.opts.from ? this.index++ : this.index--) : this.opts.callback && this.opts.callback()
		}
	};

	animation.prototype.dispose = function() {
		this.flag = !1;
	};


	window.MapPlatForm.Base.Animation = animation;

})(window);