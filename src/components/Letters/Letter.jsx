import styles from './Letter.module.css'

function Letter({letter, onClick, disabled}) {
    return (
        <div className={`${styles.letter} ${disabled ? styles.disabled : ''}`} onClick={() => !disabled && onClick()}>
            {letter}
        </div>
    )
}

export default Letter