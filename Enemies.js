class GameObject {
    constructor(context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
}

class Rat extends GameObject {

    static spriteFrames = 4;
    static spriteRows = 4;
    static frameWidth = 0;
    static frameHeight = 0;
    static sprite;

    constructor(context, x, y, speed) {
        super(context, x, y, 0, 0);

        this.radCol = 64;

        this.loadSprite();
        this.currentFrame = 0;

        this.angle = 0;
        this.speed = speed;

        this.totalTime = 0;

        this.speedboost = 0;
        this.bufferForSpeed = speed;
    }

    loadSprite() {
        if(!Rat.sprite) {
            Rat.sprite = new Image();
            Rat.sprite.onload = () => {
                Rat.frameWidth = Rat.sprite.width / Rat.spriteFrames;
                Rat.frameHeight = Rat.sprite.height / Rat.spriteRows;
            };

            Rat.sprite.src = "img/rat.png";
        }
    }

    draw() {

        if (this.currentFrame > Rat.spriteFrames - 1) {
            this.currentFrame = 0;
        }

        context.save();

        this.context.translate(this.x, this.y);
        if (this.angle < 45) {
            this.context.rotate(Math.PI / 180 * (this.angle));
        } else if (this.angle < 90) {
            this.context.rotate(-Math.PI / 180 * (this.angle % 45));
        } else if (this.angle < 135) {
            this.context.rotate(Math.PI / 180 * (this.angle % 45));
        } else if (this.angle < 180) {
            this.context.rotate(-Math.PI / 180 * (this.angle % 45));
        } else if (this.angle < 225) {
            this.context.rotate(Math.PI / 180 * (this.angle % 45));
        } else if (this.angle < 270) {
            this.context.rotate(-Math.PI / 180 * (this.angle % 45));
        } else if (this.angle < 315) {
            this.context.rotate(Math.PI / 180 * (this.angle % 45));
        } else if (this.angle < 360) {
            this.context.rotate(-Math.PI / 180 * (this.angle % 45));
        }
        this.context.translate(-this.x, -this.y);

        /*Выбор модельки в зависимости от угла*/
        if (this.angle >= 315 || this.angle <= 45) {
            this.context.drawImage(Rat.sprite, this.currentFrame * Rat.frameWidth, Rat.frameHeight * 2, Rat.frameWidth, Rat.frameHeight, this.x - this.radCol, this.y - this.radCol, this.radCol * 2, this.radCol * 2);
        } else if (this.angle > 45 && this.angle < 135) {
            this.context.drawImage(Rat.sprite, this.currentFrame * Rat.frameWidth, 0, Rat.frameWidth, Rat.frameHeight, this.x - this.radCol, this.y - this.radCol, this.radCol * 2, this.radCol * 2);
        } else if (this.angle >= 135 && this.angle <= 225) {
            this.context.drawImage(Rat.sprite, this.currentFrame * Rat.frameWidth, Rat.frameHeight, Rat.frameWidth, Rat.frameHeight, this.x - this.radCol, this.y - this.radCol, this.radCol * 2, this.radCol * 2);
        } else if (this.angle > 225 && this.angle < 315) {
            this.context.drawImage(Rat.sprite, this.currentFrame * Rat.frameWidth, Rat.frameHeight * 3, Rat.frameWidth, Rat.frameHeight, this.x - this.radCol, this.y - this.radCol, this.radCol * 2, this.radCol * 2);
        }
        context.restore();
    }

    update(secondsPassed, xReach, yReach, w, h) {

        if (this.totalTime < 0.25) {
            this.totalTime += secondsPassed;
        } else {
            this.currentFrame++;
            this.totalTime = 0;
        }

        if (this.speedboost > 0 && (this.totalTime * 1000 % 5 < 4)) {
            this.speed *= this.speedboost;
        }
        if (this.speedboost !== 0 && this.totalTime > 0.2) {
            this.speed = this.bufferForSpeed;
            this.speedboost = 0;
        }

        if (xReach - this.x < 0) {
            this.angle = Math.atan((yReach - this.y) / (xReach - this.x)) * 180 / Math.PI + 180;
        } else {
            this.angle = Math.atan((yReach - this.y) / (xReach - this.x)) * 180 / Math.PI;
        }

        this.vx = this.speed * Math.cos(Math.PI / 180 * this.angle);
        this.vy = this.speed * Math.sin(Math.PI / 180 * this.angle);

        if ((this.x + this.vx * secondsPassed < w) && (this.x + this.vx * secondsPassed > 0)) {
            this.x += this.vx * secondsPassed;
        }
        if ((this.y + this.vy * secondsPassed < h) && (this.y + this.vy * secondsPassed > 0)) {
            this.y += this.vy * secondsPassed;
        }
    }
}

class Cheese extends GameObject {
    constructor(context, x, y) {
        super(context, x, y, 0, 0);

        this.radCol = 32;

        this.image = new Image(this.radCol, this.radCol);
        this.image.src = "img/cheese.png";

        this.eaten = false;
    }

    draw() {
        if (!this.eaten) {
            this.context.drawImage(this.image, this.x - this.radCol, this.y - this.radCol, this.radCol * 2, this.radCol * 2);
        }
    }
    update() {
    }

}