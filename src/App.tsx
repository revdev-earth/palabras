import { useEffect } from "react"
import AddWordForm from "./components/AddWordForm"
import ControlsPanel from "./components/ControlsPanel"
import PracticeSection from "./components/PracticeSection"
import StatsHeader from "./components/StatsHeader"
import WordsTable from "./components/WordsTable"
import { useDispatch, useSelector } from "./hooks"
import { setSettings as setSettingsAction } from "./store"
import { STORE_KEY, SETTINGS_KEY, todayKey } from "./utils"

function App() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.app.words)
  const settings = useSelector((s) => s.app.settings)
  const practiceActive = useSelector((s) => s.app.practiceQueue.length > 0)
  const summary = useSelector((s) => s.app.summary)

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(words))
  }, [words])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const tickNewDay = () => {
      const today = todayKey()
      if (settings.lastSeenDay !== today) dispatch(setSettingsAction({ lastSeenDay: today }))
    }
    tickNewDay()
    const id = setInterval(tickNewDay, 60 * 1000)
    return () => clearInterval(id)
  }, [dispatch, settings.lastSeenDay])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <StatsHeader />

      {!practiceActive && (
        <div className="grid gap-5 lg:grid-cols-[1.1fr,1.4fr]">
          <AddWordForm />
          <ControlsPanel />
        </div>
      )}

      {!practiceActive && <WordsTable />}

      <PracticeSection />

      {!practiceActive && summary && (
        <section className="mt-4 rounded-xl border border-ink-100 bg-ink-50/80 px-4 py-3 text-sm text-ink-800">
          {summary}
        </section>
      )}
    </div>
  )
}

export default App
