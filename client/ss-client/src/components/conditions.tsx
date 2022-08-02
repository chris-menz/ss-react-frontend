import react, { useEffect, useState } from "react"
import { request, gql } from 'graphql-request' 
import { ObjectID } from "bson"
import { Link } from 'react-router-dom';
import "./conditions.css"

interface Props {
    spotId: string
}

export default function Conditions(props: Props){
    const [spot, setSpot] = useState<string>("")
    const [buoyId, setBuoyId] = useState<string>("")
    const [latlng, setLatlng] = useState<string>("")
    const [spotConditions, setSpotConditions] = useState<SpotConditions>({
        swellHeight: 0,
        swellPeriod: 0,
        swellDirection: "N",
        windWaveHeight: 0,
        windWavePeriod: 0,
        windWaveDirection: "N",
        month: 0,
        day: 0,
        hour: 0,
        minute: 0
    })
    const [spotWeather, setSpotWeather] = useState<SpotWeather>({
        temp: 0,
        winddir: 0,
        windspeed: 0,
        uvindex: 0,
        sunrise: "",
        sunset: ""
    })

    interface SpotInfo {
        spot: string
        buoyId: string
        latlng: string
    }

    interface SpotConditions {
        month: number
        day: number
        hour: number
        minute: number
        swellHeight: number
        swellPeriod: number
        swellDirection: string
        windWaveHeight: number
        windWavePeriod: number
        windWaveDirection: string
    }

    interface SpotWeather {
        temp: number
        winddir: number
        windspeed: number
        uvindex: number
        sunrise: string
        sunset: string
    }

    const endpoint = "http://165.227.125.165/ss/api/graphql"

    const getSpotInfoQuery = gql`
        query{
            SurfSpot(_id: "${props.spotId}") {
                spot
                buoyId
                latlng
            }
        }
    `

    const getBuoyDataQuery = gql`
        query{
            BuoyData(buoyId: "${buoyId}"){
                measurements{
                    month
                    day
                    hour
                    minute
                    swellHeight
                    swellPeriod
                    swellDirection
                    windWaveHeight
                    windWavePeriod
                    windWaveDirection
                  }
            }
        }
    `

    const getCurrentWeatherQuery = gql`
        query{
            CurrentWeather(latlng: "${latlng}") {
                temp
                winddir
                windspeed
                uvindex
                sunrise
                sunset
            }
        }
    `


    useEffect(() => {
        request(endpoint, getSpotInfoQuery).then((data) => {
            const spotInfo: SpotInfo = data.SurfSpot
            setSpot(spotInfo.spot)
            setBuoyId(spotInfo.buoyId)
            setLatlng(spotInfo.latlng)
        })
    }, [])

    useEffect(() => {
        if(buoyId && latlng){
            request(endpoint, getBuoyDataQuery).then(data => {
                for(let i = 0; i < data.BuoyData.measurements.length; ++i){
                    
                }
                setSpotConditions(data.BuoyData.measurements[0])
            })
            request(endpoint, getCurrentWeatherQuery).then(data => {
                setSpotWeather(data.CurrentWeather)
            })
        }   
    }, [buoyId, latlng])

    return(
        <main>
            <Link to={"/"}>Back to Search</Link>
            <div className="header">
                Current Conditions for {spot}:
            </div>
            <div>
                Swell Waves: {(spotConditions.swellHeight * 3.1).toFixed(1)} ft. @ {spotConditions.swellPeriod.toFixed(0)} seconds, {spotConditions.swellDirection}
            </div>
            <div>
                Wind Waves: {(spotConditions.windWaveHeight * 3.1).toFixed(1)} ft. @ {spotConditions.windWavePeriod.toFixed(0)} seconds, {spotConditions.windWaveDirection}
            </div>
            <div>
                Air Temperature: {(spotWeather.temp).toFixed(0)} °F
            </div>
            <div>
                Wind: {spotWeather.windspeed.toFixed(0)}kts, {spotWeather.winddir}°
            </div>
            <div>
                UV Index: {spotWeather.uvindex}
            </div>
            <div>
                Sunrise: {spotWeather.sunrise.substring(0, 5)}
            </div>
            <div>
                Sunset: {spotWeather.sunset.substring(0, 5)}
            </div>
            <br />
            <div>
                Buoy data source: https://www.ndbc.noaa.gov/station_page.php?station={buoyId}
            </div>
            <div>
                Buoy data current as of {spotConditions.month}/{spotConditions.day}, {spotConditions.hour}:{spotConditions.minute} UTC (EST +8:00)
            </div>
            <div>
                Weather data source: https://www.visualcrossing.com/
            </div>

        </main>
    )
}