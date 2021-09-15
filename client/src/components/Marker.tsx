import styles from './Marker.module.css'

interface IProps {
    lat: number
    lng: number
    src: string
}

const Marker = ({ lat, lng, src }: IProps) => {
    return (
        <div className={styles.marker}>
            <img src={src} className={styles.logo} />
        </div>
    )
}

export default Marker