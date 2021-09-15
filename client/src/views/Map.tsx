import axios from 'axios'
import GoogleMapReact from 'google-map-react'
import { useEffect, useRef, useState } from 'react'
import { Marker, Button } from '../components'
import ReactSlider from 'react-slider'
import debounce from 'lodash.debounce'


interface ICoordinate {
    latitude: number
    longitude: number
    bearing?: number
}

interface ILocation extends ICoordinate {
    name: string
    distance?: number
}

interface IDriver {
    driver_id: string
    location: ICoordinate
}

let locations: ILocation[] = [
    {
        name: 'Singapore',
        latitude: 1.285194,
        longitude: 103.8522982,
    },
    {
        name: 'London',
        latitude: 51.5049375,
        longitude: -0.0964509,
    }
]

const Map = () => {
    const [nearestLocation, setNearestLocation] = useState(locations[0])
    const [currentLocation, setCurrentLocation] = useState(nearestLocation)
    const [drivers, setDrivers] = useState<IDriver[]>([])
    const [driversCount, setDriversCount] = useState(10)
    const setDriversCountDebounced = useRef(debounce(setDriversCount, 150))

    const listDrivers = async () => {
        const { data } = await axios.get('http://localhost:5000/drivers', {
            params: {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                count: driversCount,
            }
        })

        setDrivers(data.drivers || [])
    }

    useEffect(() => {
        listDrivers()
    }, [currentLocation, driversCount])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const getDistance = (coordinate: ICoordinate) => {
                return Math.sqrt(Math.pow(position.coords.latitude - coordinate.latitude, 2) + Math.pow(position.coords.longitude - coordinate.longitude, 2))
            }

            locations = locations.map(location => {
                location.distance = getDistance(location)
                return location
            })

            let nearestLocation = locations[0]

            for (let i = 1; i < locations.length; i++) {
                if (locations[i].distance! < nearestLocation.distance!) {
                    nearestLocation = locations[i]
                }
            }

            setNearestLocation(nearestLocation)
        })

        setInterval(() => listDrivers(), 30 * 1000) // List drivers every 30 sec interval
    }, [])

    const isSelected = (location: ICoordinate) => {
        return location.latitude === currentLocation.latitude && location.longitude === currentLocation.longitude
    }

    const adjustDriversCount = (value: number) => {
        setDriversCountDebounced.current(value)
    }

    const LocationMarkers = locations.map((location) => {
        return <Marker key={location.name} src="/images/splyt.jpeg" lat={location.latitude} lng={location.longitude} />
    })

    const DriverMarkers = drivers.map((driver) => {
        return <Marker key={driver.driver_id} src="/images/car.svg" lat={driver.location.latitude} lng={driver.location.longitude} />
    })

    const LocationButtons = locations.map((location) => {
        return (
            <Button
                onClick={() => setCurrentLocation(location)}
                isText={!isSelected(location)}
            >
                {location.name}
            </Button>
        )
    })

    return (
        <div className="flex justify-around space-x-10">
            <div style={{ height: 500, width: 500 }}>
                <GoogleMapReact
                    defaultCenter={{ lat: nearestLocation.latitude, lng: nearestLocation.longitude }}
                    defaultZoom={14}
                    center={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
                >
                    {LocationMarkers}
                    {DriverMarkers}
                </GoogleMapReact>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-5">Locations</h2>
                <div className="flex mb-5">
                    {LocationButtons}
                </div>
                <span
                    className="text-primary font-bold hover:underline cursor-pointer block mb-10"
                    onClick={() => setCurrentLocation(nearestLocation)}
                >
                    Go to Nearest
                </span>

                <h2 className="text-2xl font-bold mb-5">{driversCount} Taxis</h2>
                <ReactSlider
					step={1}
					min={5}
					max={20}
					className="w-full h-5 pr-2 my-4 bg-gray-100 rounded-lg cursor-grab"
					thumbClassName="absolute w-5 h-5 cursor-grab bg-primary rounded-full focus:outline-none"
					value={driversCount}
					onChange={(value: any) => adjustDriversCount(value)}
				/>
            </div>
        </div>
    )
}

export default Map