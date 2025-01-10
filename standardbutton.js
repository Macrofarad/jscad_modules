/**
 * Standard Button
 * @category Creating Shapes
 * @description A script to make a standard 2d or 3d button
 * @tags extrude, linear, extrudelinear, button
 * @authors Macrofarad
 * @licence MIT License
 */

const jscad = require('@jscad/modeling')
const { rectangle, circle } = jscad.primitives
const { extrudeLinear } = jscad.extrusions
const { translate } = jscad.transforms
const {  union } = require('@jscad/modeling').booleans

const MakeButton=(dimensions=2,renderleglength=false)=>{
  const ButtonDimensions={
    buttonx:6
    ,buttony:6
    ,buttonz:3
    ,buttonpushcylinderabovebase:1.25
    ,buttonpushcylinderradius:1.75
    ,legy:0.66
    ,legx:0.33
    ,legtall:4
  }
  let ShapesToOutput=[]
  let ButtonBase = rectangle({size: [ButtonDimensions["buttonx"], ButtonDimensions["buttony"]]})
  let ButtonPusher = circle({radius: ButtonDimensions["buttonpushcylinderradius"]})
  let leg = rectangle({size: [ButtonDimensions["legx"], ButtonDimensions["legy"]]}) //create template leg profile
  
  if(dimensions==3){ //extrude to third dimension if required
    ButtonBase= extrudeLinear({height: ButtonDimensions["buttonz"]}, ButtonBase)
    ButtonPusher=extrudeLinear({height: (ButtonDimensions["buttonz"]+ButtonDimensions["buttonpushcylinderabovebase"])}, ButtonPusher)
    
    if(renderleglength){ leg= translate([0,0,-(ButtonDimensions["legtall"]-ButtonDimensions["legx"])],extrudeLinear({height: ButtonDimensions["legtall"]}, leg)) } //render entire leg
    if(!renderleglength){ leg= translate([0,0,0],extrudeLinear({height: ButtonDimensions["legx"]}, leg)) } //don't render entire leg length
  }
  //make button
  ShapesToOutput.push(ButtonBase)
  ShapesToOutput.push(ButtonPusher)
  ShapesToOutput.push(ButtonPusher)
  //make legs
  ShapesToOutput.push(translate([(0.5*ButtonDimensions["buttonx"]), (0.5*ButtonDimensions["buttony"])-(0.5*ButtonDimensions["legy"]), 0], leg))
  ShapesToOutput.push(translate([(-0.5*ButtonDimensions["buttonx"]), (0.5*ButtonDimensions["buttony"])-(0.5*ButtonDimensions["legy"]), 0], leg))
  ShapesToOutput.push(translate([(0.5*ButtonDimensions["buttonx"]), -(0.5*ButtonDimensions["buttony"])+(0.5*ButtonDimensions["legy"]), 0], leg))
  ShapesToOutput.push(translate([(-0.5*ButtonDimensions["buttonx"]), -(0.5*ButtonDimensions["buttony"])+(0.5*ButtonDimensions["legy"]), 0], leg))
  
  if(dimensions==3){ union(...ShapesToOutput) } //union the shapes if 3d 
  return ShapesToOutput
}

const main = () => {
  const shapes = []
  //shapes.push(translate([8, 0, 0], MakeButton(2)))
  shapes.push(MakeButton(3))
  return shapes
}

module.exports = { main }
