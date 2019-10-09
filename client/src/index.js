import React,{useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import MapComponent from './map_component'
import axios from "axios";
import moment from 'moment';
import './styles.css'

const Index = () => {

  const [locations, setLocations] = useState();
  const [loc, setLoc] = useState();
 
  
  useEffect(() => {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then((json) => {
        setLocations(json)
      })
  }, [])

  // Display times per day
  const locTimes = (loc) => {
    const locArray = [];
    return loc.map(l => {
      // Display unique time
      if(!locArray.includes(moment(l.time).format('YYYY-MM-DD hh:mm'))){
        const time = moment(l.time).format('YYYY-MM-DD hh:mm');
        locArray.push(time);
        return (
          <option value={time} key={l.uuid}>{time}</option>
        )
      }
    
    })
  }

  // Handle the click event to get the location at an exact time
  const handleChange = (e) => {
    const url = `http://localhost:3000/location/${e.target.value}`;
    axios.get(url).then(res => {
      setLoc(res.data);
    }).catch(err => {
      console.error(err);
    })
  }

  return (
    <div>
      <div className='header'>
        <h1>Welcome to the example task!</h1>
      </div>
      {/* TODO(Task 2): Add a slider to select datetime in the past.
        Pass the selected value as prop to the MapContainer */ }
      
      <div>
      {
          locations && _.map(locations, (loc, key) => {
            return (
              <div key={key}>
                <label>{key}</label>
                <select name="" id="" onChange={handleChange}>
                  {locTimes(loc)}
                </select>
                
              </div>
            )
          })
        }
        {!locations && <p>Loading history</p>}
      </div>
      <MapComponent loc={loc}/>
    </div>)
}

ReactDOM.render(<Index />, document.getElementById('main-container'))
