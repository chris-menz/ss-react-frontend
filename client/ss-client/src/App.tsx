import './App.css';
import react, { useEffect, useState } from "react"
import { request, gql } from 'graphql-request' 
import { ObjectID } from "bson"
import { Link } from 'react-router-dom';


function App() {
  const endpoint = "http://165.227.125.165/ss/api/graphql"
  const query = gql`
      query{
          SurfSpots {
              _id
              spot
          }
      }
  `

  interface SurfSpot{
      _id: ObjectID
      spot: string
      location: string
      region: string
      buoyId: string
      latlng: string
  }

  const [surfSpots, setSurfSpots] = useState<SurfSpot[]>([])
  const [selectedSpotId, setSelectedSpotId] = useState<string>("")

  useEffect(() => {
    request(endpoint, query).then((data) => {
        setSurfSpots(data.SurfSpots)
    })
  }, [])

  useEffect(() => {
    if(surfSpots.length > 0){
        setSelectedSpotId(surfSpots[0]._id + "")
    }
  }, [surfSpots])

  return(
    <main>
        <div className='header'>
          Select a surf spot and search to see its current conditions!
        </div>
        <select 
          onChange={e => setSelectedSpotId(e.target.value)}
          className="select"
        >
          {surfSpots.map(surfSpot => 
            <option 
              key={surfSpot.spot} 
              value={surfSpot._id + ""} 
            >
              {surfSpot.spot}
            </option>
          )}
        </select>
      <Link 
        to={"/conditions/" + selectedSpotId}
        className="search"
      >
        Search
      </Link>
    </main>
  )

}

export default App;
