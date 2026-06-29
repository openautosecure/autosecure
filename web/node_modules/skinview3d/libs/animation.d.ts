import { PlayerObject } from "./model.js";
/**
 * An animation which can be played on a {@link PlayerObject}.
 *
 * This is an abstract class. Subclasses of this class would implement
 * particular animations.
 */
export declare abstract class PlayerAnimation {
    /**
     * The speed of the animation.
     *
     * @defaultValue `1.0`
     */
    speed: number;
    /**
     * Whether the animation is paused.
     *
     * @defaultValue `false`
     */
    paused: boolean;
    /**
     * The current progress of the animation.
     */
    progress: number;
    /**
     * Plays the animation.
     *
     * @param player - the player object
     * @param delta - progress difference since last call
     */
    protected abstract animate(player: PlayerObject, delta: number): void;
    private currentId;
    private progress0;
    private animationObjects;
    /**
     * Plays the animation, and update the progress.
     *
     * The elapsed time `deltaTime` will be scaled by {@link speed}.
     * If {@link paused} is `true`, this method will do nothing.
     *
     * @param player - the player object
     * @param deltaTime - time elapsed since last call
     */
    update(player: PlayerObject, deltaTime: number): void;
    /**
     * Adds a new animation based on the original animation and returns its id.
     *
     * @param fn - The animation function to be added, which takes a player object and progress value.When calling addAnimation. progress is 0.
     * @returns The id of the newly added animation.
     *
     * @example
     * Rotate the player while playing the idle animation.
     * ```
     * skinViewer.animation = new skinview3d.IdleAnimation();
     * skinViewer.animation.addAnimation((player, progress)=>player.rotation.y = progress);
     * ```
     */
    addAnimation(fn: (player: PlayerObject, progress: number, currentId: number) => void): number;
    /**
     * Removes an animation created by the addAnimation method by its id.
     *
     * If the id is undefined, this method will do nothing.
     *
     * @param id - The id of the animation to remove.
     *
     * @example
     * Rotate the player then stop and reset the rotation after 1s.
     * ```
     * var r;
     * r=skinViewer.animation.addAnimation((pl, pr) => {
     * 	pl.rotation.x = pr;
     * });
     * setTimeout(()=>{
     * 	skinViewer.animation.addAnimation((pl, pr,id) => {
     * 		pl.rotation.x=0;
     * 		skinViewer.animation.removeAnimation(id);
     * 	})
     * 	skinViewer.animation.removeAnimation(r);
     * },1000)
     * ```
     */
    removeAnimation(id: number | undefined): void;
}
/**
 * A class that helps you create an animation from a function.
 *
 * @example
 * To create an animation that rotates the player:
 * ```
 * new FunctionAnimation((player, progress) => player.rotation.y = progress)
 * ```
 */
export declare class FunctionAnimation extends PlayerAnimation {
    fn: (player: PlayerObject, progress: number, delta: number) => void;
    constructor(fn: (player: PlayerObject, progress: number, delta: number) => void);
    protected animate(player: PlayerObject, delta: number): void;
}
export declare class IdleAnimation extends PlayerAnimation {
    protected animate(player: PlayerObject): void;
}
export declare class WalkingAnimation extends PlayerAnimation {
    /**
     * Whether to shake head when walking.
     *
     * @defaultValue `true`
     */
    headBobbing: boolean;
    protected animate(player: PlayerObject): void;
}
export declare class RunningAnimation extends PlayerAnimation {
    protected animate(player: PlayerObject): void;
}
export declare class FlyingAnimation extends PlayerAnimation {
    protected animate(player: PlayerObject): void;
}
export declare class WaveAnimation extends PlayerAnimation {
    whichArm: string;
    constructor(whichArm?: "left" | "right");
    protected animate(player: PlayerObject): void;
}
export declare class CrouchAnimation extends PlayerAnimation {
    /**
     * Whether to show the progress of animation.
     * Because there is no progress in the crouch animation in Minecraft, the default value here is false.
     * @defaultValue `false`
     */
    showProgress: boolean;
    /**
     * Whether to run this animation once.
     *
     * @defaultValue `false`
     */
    runOnce: boolean;
    private isRunningHitAnimation;
    private hitAnimationSpeed;
    /**
     * Add the hit animation.
     *
     * @param speed - The speed of hit animation and the default is follow the speed of CrouchAnimation.But if the speed of CrouchAnimation is 0,this animation will not run.
     */
    addHitAnimation(speed?: number): void;
    private erp;
    private isCrouched;
    protected animate(player: PlayerObject): void;
}
export declare class HitAnimation extends PlayerAnimation {
    protected animate(player: PlayerObject): void;
}
export declare class SwimAnimation extends PlayerAnimation {
    private lock;
    protected animate(player: PlayerObject): void;
}
