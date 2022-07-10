let dir = 1;
const p1 = {up:0, down:0, pts:0, yPos:0},
      p2 = {...p1}

$(window).on('keydown', (e)=>{ //console.log(e.keyCode)
  e.preventDefault();
  if (e.keyCode==83) p1.up = 1;
  if (e.keyCode==87) p1.down = 1;
  if (e.keyCode==40) p2.up = 1;
  if (e.keyCode==38) p2.down = 1;
});

$(window).on('keyup', (e)=>{
  if (e.keyCode==83) p1.up = 0;
  if (e.keyCode==87) p1.down = 0;
  if (e.keyCode==40) p2.up = 0;
  if (e.keyCode==38) p2.down = 0;
});

gsap.ticker.add(()=>{

  for (let i=1; i<=2; i++){
    const p = eval('p'+i)
    
    if (navigator.getGamepads()[i-1]) {
      const gp = navigator.getGamepads()[i-1]
      p.up = Number( gp.axes[1]==1 )
      p.down = Number( gp.axes[1]==-1 )
    }
    
    p.yPos = gsap.getProperty('.p'+i, 'y')
    if (p.up) gsap.to('.p'+i, {y:'+=50'})
    if (p.down) gsap.to('.p'+i, {y:'-=50'})
    if (p.yPos>550) gsap.to('.p'+i, {y:550})
    if (p.yPos<1) gsap.to('.p'+i, {y:1})  
  }
})

function moveBall(){
  gsap.to('.ball', {duration:2, ease:'none', x:(dir<0)?0:985, y:Math.random()*550+25, onComplete:hitTest})
}

function hitTest(){
  const bPos = gsap.getProperty('.ball', 'y')
  const yPos = (dir<0) ? p1.yPos : p2.yPos
  if (bPos>yPos-5 && bPos<yPos+60) {
    (dir<0) ? p1.pts++ : p2.pts++
    (dir<0) ? $('.t1').html(p1.pts) : $('.t2').html(p2.pts)
    if (dir<0) gsap.fromTo('.p1', {opacity:1, x:-5}, {opacity:0.5, x:0, ease:'back'})
    else gsap.fromTo('.p2', {opacity:1, x:5}, {opacity:0.5, x:0, ease:'back'})
  }
  dir = (dir>0) ? -1:1
  moveBall()
}

gsap.timeline({onComplete:moveBall})
    .set('.p1, .p2', {y:268})
    .to('#stage', {opacity:1})