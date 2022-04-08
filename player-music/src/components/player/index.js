import React from 'react';
//Components
import {Transition} from "https://cdn.skypack.dev/react-transition-group@4.4.1";
import '../../App.css';
import { 
	ThreeDots, 
	ChevronLeft, 
	PauseFill, 
	PlayFill,
	SkipBackwardFill,
	SkipForwardFill,
	Shuffle,
	ArrowRepeat,
	Heart,
	BoxArrowUpRight,
	HeartFill
} from "https://cdn.skypack.dev/react-bootstrap-icons@1.5.0";
//Styled Components
import { Containerplayer } from '../containerplayer/style';
import { Containerheader } from '../header/style';
import { Playercontent } from '../playercontent/style';

//Api
import { tracks } from "../../api";

const player = new Audio(tracks[0].source)
player.setAttribute('preload', 'metadata')
const userOptions = React.createContext({
	shuffle: false,
	repeat: false,
})

function Options(props){
	let options = React.useContext(userOptions)
	let [shuffl, setShuffle] = React.useState(options.shuffle)
	let [repet, setRepeat] = React.useState(options.repeat)
	let [fav, setFav] = React.useState(tracks[props.idx].favorited)
	
	React.useEffect(() => setFav(tracks[props.idx].favorited))
	
	function shuffle(){
		options.shuffle = !options.shuffle
		options.repeat = false
		setShuffle(!shuffl)
		setRepeat(false)
	}
	
	function repeat(){
		options.repeat = !options.repeat
		options.shuffle = false
		setShuffle(false)
		setRepeat(!repet)
	}
	
	function favorite(){
		tracks[props.idx].favorited = !tracks[props.idx].favorited
		setFav(tracks[props.idx].favorited)
	}

	function openURL(){
		window.open(tracks[props.idx].url, "_blank")
	}
	
	return(
		<div className="options">
			{
				shuffl &&
				<button onClick={shuffle} className="opt" style={{color: '#147CC0'}}>
					<Shuffle/>
				</button>
				||
				<button onClick={shuffle} className="opt" >
					<Shuffle/>
				</button>
			}
			<button className="opt" onClick={openURL}>
				<BoxArrowUpRight/>
			</button>
			{
				fav &&
			<button onClick={favorite}  className="opt" style={{color: '#147CC0'}}>
				<HeartFill/>
			</button>
					||
				<button onClick={favorite}  className="opt" >
				<Heart/>
			</button>
						
				}
			{
				repet &&
			<button onClick={repeat} className="opt" style={{color: '#147CC0'}}>
				<ArrowRepeat/>
			</button>
					||
						<button onClick={repeat} className="opt">
				<ArrowRepeat/>
			</button>
				}
		</div>
	);
}

function Control(props){
	
	return(
		<div className="controls">
			<button 
				className="controlButton"
				onClick={
					x => props.setIdx(props.idx-1 < 0 ? 8 : props.idx-1)
				}>
				<SkipBackwardFill />
			</button>
			{
				props.playState === true ? 
					<button 
						className="centerButton"
						onClick={x => props.setPlayState(false)}>
						<PauseFill />
					</button> : 
					<button
						className="centerButton"
						onClick={x => props.setPlayState(true)}>
						<PlayFill />
					</button>
			}
			<button
				className="controlButton"
				onClick={x => props.setIdx((props.idx+1)%9)}>
				<SkipForwardFill />
			</button>
		</div>
	);
}

function Progress(props){
	let [currLength, setCurrLength] = React.useState(0)
	let [length, setLength] = React.useState(0)
	let options = React.useContext(userOptions)
	const progressBar = document.querySelector('.progressBar')
	
	function updateProgress(e){
		let offset = e.target.getBoundingClientRect().left
		let newOffSet = e.clientX
		let newWidth = newOffSet - offset
		progressBar.style.width = newWidth+"px"
		let secPerPx = length / 280
		player.currentTime = secPerPx * newWidth
	}
	
	setInterval(() => {
		setLength(Math.ceil(player.duration))
		setCurrLength(Math.ceil(player.currentTime))
		let secPerPx = Math.ceil(player.duration) / 280
		let newWidth = player.currentTime / secPerPx
		document.querySelector('.progressBar').style.width = newWidth+"px"
		if(player.currentTime === player.duration){
			if(options.shuffle === true){
				props.setIdx((parseInt(Math.random()*1000))%9)
			}
			else if(options.repeat === true){
				player.play()
			}
			else{
				props.setIdx((props.idx+1)%9)
			}
		}
	}, 1000);
	
	function formatTime(s){
		return Number.isNaN(s) ? '0:00' : (s-(s%=60))/60+(9<s?':':':0')+s
	}
	
	return(
		<div className="progress">
			<div className="currentTime">
				<p>{formatTime(currLength)}</p>
			</div>
			<div 
			className="progressCenter" 
			onClick={(e) => updateProgress(e)}>
				<div className="progressBar">
				</div>
			</div>
			<div className="songLength">
				<p>{formatTime(length)}</p>
			</div>
		</div>
	);
}

function Avatar(props){	
	return(
		<>
			<img src={tracks[props.idx].cover} className="avatar1" />
			<img src={tracks[props.idx].cover} className="avatar"/>
			<h4 className="name">{tracks[props.idx].artist}</h4>
			<h1 className="title">{tracks[props.idx].name}</h1>
		</>
	);
}

function Container(){
	let [idx, setIdx] = React.useState(0);
	let [playState, setPlayState] = React.useState(false);
	let oldIdx = React.useRef(idx)
	React.useEffect(() => {
		
		if(playState === true)
			player.play()
		else
			player.pause()
		if(idx !== oldIdx.current){
			player.pause()
			player.src = tracks[idx].source
			player.load()
			player.play()
			setPlayState(true)
			oldIdx.current = idx
		}
			
	})
	
	return(
		<Playercontent>
			<Avatar idx={idx}/>
			<Progress 
				setIdx={setIdx} 
				idx={idx} 
			/>
			<Control 
				setIdx={setIdx} 
				idx={idx}  
				playState={playState} 
				setPlayState={setPlayState}/>
			<Options 
				setIdx={setIdx} 
				idx={idx}
			/>
		</Playercontent>
	);
}

function Header(propsheader){
	return(
		<Containerheader>
			<button className="icon">
				<ChevronLeft/>
			</button>
			<h1 className="headerText">{propsheader.title}</h1>
			<button className="icon">
				<ThreeDots/>
			</button>
		</Containerheader>
	);
}

// root method
function Player() {
	return (
		<Containerplayer>
			<Header title="Aplicativo de música"/>
			<Container/>
		</Containerplayer>
	);
}

export default Player;