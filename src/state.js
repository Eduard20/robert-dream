export class RideSession {
  constructor(){this.phase='coin';this.duration=30;this.ride=null;this.elapsed=0;this.stopElapsed=0;}
  coin(){if(this.phase!=='coin')return false;this.phase='choose';this.ride=null;return true;}
  choose(id){if(this.phase!=='choose')return false;this.ride=id;this.phase='boarding';return true;}
  boarded(){if(this.phase!=='boarding')return false;this.phase='ready';return true;}
  setDuration(seconds){if(![30,60,120].includes(seconds)||['running','stopping'].includes(this.phase))return false;this.duration=seconds;return true;}
  start(){if(this.phase!=='ready')return false;this.phase='running';this.elapsed=0;return true;}
  stop(){if(this.phase!=='running')return false;this.phase='stopping';this.stopElapsed=0;return true;}
  tick(dt){if(this.phase==='running'){this.elapsed+=dt;if(this.elapsed>=this.duration)this.stop();}else if(this.phase==='stopping'){this.stopElapsed+=dt;if(this.stopElapsed>=3)this.phase='coin';}}
}
