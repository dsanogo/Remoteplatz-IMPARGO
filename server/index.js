const express = require('express')
const app = express()

const moment = require('moment');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})


app.use(express.json())

const formatDate = (dateTime) => {
  return moment(dateTime).format('YYYY-MM-DD');
}


const exampleData = require('../data/tracking.json');

const splittedData = () => {
    
  // variable chunks will hold the segments per date
  let chunks = {};
  const dataLength = exampleData.length;
  // get the first date to start
  const firstDate = formatDate(exampleData[0].time);
  const lastDate = formatDate(exampleData[dataLength - 1].time);

  // Get the start date which is the least one
  let startDate = firstDate > lastDate ? lastDate : firstDate;

  // Loop through the data and split them into chuncks per Date
  for (let i = dataLength - 1 ; i >= 0; i--) {
    const chunk = exampleData[i];
    
    // Check if the check time is greater than the startDate, if it's the next date
    if(formatDate(chunk.time) > startDate) {

      // set the start date to the new chunk time
      startDate = formatDate(chunk.time);

      // Add the chunk to the chunks array
      chunks[startDate] = [chunk];
      
    }else {
      // Check if the check is not in the chunks array
      if(chunks[startDate] === undefined){
        chunks[startDate] = [chunk];
      }else {
        // If chunk found, then push the element to the chunk
        chunks[startDate].push(chunk)
      }
    }
  }

  // return the chunks
  return chunks;
}

app.get('/', (req, res) => {
  // TODO(Task 1): Split tracking data into trip segments for example by using the time property.
  res.send(splittedData());
})

app.get('/location/:when', (req, res) => {
  // TODO(Task 2): Return the tracking data closest to `req.params.when` from `exampleData`.
  const paramTime = req.params.when;
  const splittedDat = splittedData();
  const location = splittedDat[moment(paramTime).format('YYYY-MM-DD')].find(loc => {
    return moment(loc.time).format('YYYY-MM-DD hh:mm') === paramTime;
  });

  console.log(paramTime, location);
  res.send(location);
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
