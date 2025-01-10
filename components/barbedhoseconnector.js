function CreateBarbedHoseConnector(UserArguments={}){
    //https://openjscad.xyz/dokuwiki/doku.php?id=en:design_guide_path
    //to do: round top to prevent rocks from getting stuck
    
  const { path2, geom2 } = require('@jscad/modeling').geometries;
  const {  extrudeRotate } = require('@jscad/modeling').extrusions;
    
  const DefaultArgs={
    "hoseFittingOutterD":5
    ,"HoseFittingWallThicknessMultiplier":0.2
    ,"num_barbs":3
    ,"barbtapermultiplier":0.1
    ,"hasbase":true
    ,"barbHeightMultiplier":0.6
    ,"barbHoleMultiplier":0.4
    ,"WallThicknessMultiplier":0.5
  };
  const UserArgsSani={...DefaultArgs,...UserArguments};//overwrite defaults with user params   
  const insideHoleR=(UserArgsSani["hoseFittingOutterD"]*UserArgsSani["barbHoleMultiplier"])*0.5;
  const BarbOutcropR=0.5*(UserArgsSani["hoseFittingOutterD"]-(UserArgsSani["hoseFittingOutterD"]*UserArgsSani["barbHoleMultiplier"]));
  const BarbHeight=UserArgsSani["hoseFittingOutterD"]*UserArgsSani["barbHeightMultiplier"];
  const WallThicknessMultiplier=UserArgsSani["WallThicknessMultiplier"];
      
  let p1 = path2.create([]); //array of points
  p1 = path2.appendPoints([[insideHoleR,0]],p1);  //bottom-in of inner 
  p1 = path2.appendPoints([[(insideHoleR+WallThicknessMultiplier*BarbOutcropR),0]],p1);  //bottom-out of inner rectangle 
  if(UserArgsSani["hasbase"]){
    p1 = path2.appendPoints([[(insideHoleR+BarbOutcropR),0]],p1);  //bottom-out of base rectangle 
    p1 = path2.appendPoints([[(insideHoleR+BarbOutcropR),UserArgsSani["barbtapermultiplier"]*BarbHeight]],p1);  //top-out of inner rectangle 
  }
      
  for (let BarbIndex = 0; BarbIndex < UserArgsSani["num_barbs"]; BarbIndex++) {
    p1 = path2.appendPoints([[(insideHoleR+WallThicknessMultiplier*BarbOutcropR),(BarbHeight*BarbIndex)]],p1); 
    p1 = path2.appendPoints([[(insideHoleR+BarbOutcropR),(BarbHeight*BarbIndex)+(UserArgsSani["barbtapermultiplier"]*BarbHeight)]],p1); 
    p1 = path2.appendPoints([[(insideHoleR+WallThicknessMultiplier*BarbOutcropR),BarbHeight*(BarbIndex+1)]],p1); //top
  } 
      
  p1 = path2.appendPoints([[(insideHoleR+WallThicknessMultiplier*BarbOutcropR),(UserArgsSani["num_barbs"]*BarbHeight)]],p1);  //top-out out of inner rectangle 
  p1 = path2.appendPoints([[insideHoleR,(UserArgsSani["num_barbs"]*BarbHeight)]],p1);  //top-in of inner rectangle
  p1 = path2.appendPoints([[insideHoleR,0]],p1);  //bottom-in of inner //close path 
        
  const PathToShape = geom2.fromPoints(path2.toPoints(p1));
  const ShapeToExtrude = extrudeRotate({segments: 64}, PathToShape)
  return ShapeToExtrude;   
}
    

const main = () => {
  let RenderList=[];
  RenderList.push(CreateBarbedHoseConnector({
    "num_barbs":2
    ,"hoseFittingOutterD":19.1
  }));
  return RenderList;
}    
module.exports = { main }  
