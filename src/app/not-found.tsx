'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import styles from './not-found.module.scss'

export default function NotFoundPage() {
  const router = useRouter()

  const [seconds, setSeconds] = useState<number>(10)

  useEffect(() => {
    const counter = setInterval(() => {
      setSeconds((prevSeconds: number) => prevSeconds - 1)
      if (seconds <= 1) router.push('/')
    }, 1000)

    return () => clearInterval(counter)
  }, [router, seconds])

  return (
    <main className={styles.notFound}>
      <h1>Nie znaleziono strony!</h1>

      <p className={styles.description}>Powrót do generatora nastąpi za [{seconds}] sekund</p>
    </main>
  )
}
