"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, LogOut } from "lucide-react"

import { AudioPanel } from "+/components/AudioPanel"
import { MemoryMenu } from "+/components/MemoryMenu"
import AuthModal from "+/components/auth/AuthModal"
import ResetPasswordModal from "+/components/auth/ResetPasswordModal"
import { logout } from "+/components/auth/hooks/getSession"
import { useSession } from "+/components/auth/hooks/useSession"
import { useDispatch, useSelector } from "+/redux"
import { setAuthModalOpen, setIsAuthenticated } from "+/redux/slices/auth"
import { setUser } from "+/redux/slices/user"

export function Header() {
  const dispatch = useDispatch()
  const reduxUser = useSelector((state) => state.user)
  const reduxAuth = useSelector((state) => state.auth.isAuthenticated)
  const { isLoading, user, isAuthenticated, clearSession, refreshSession } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const userEmail = reduxUser?.email || user?.email
  const userName = reduxUser?.name || user?.name
  const userLastName = reduxUser?.lastName || user?.lastName
  const isAuthed = reduxAuth || isAuthenticated

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    clearSession()
    dispatch(setUser(null))
    dispatch(setIsAuthenticated(false))
    setMenuOpen(false)
    await refreshSession()
  }

  return (
    <>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Palabras</h1>
          <div className="mt-1 text-xs text-slate-500">
            {isLoading
              ? "Cargando sesion..."
              : userEmail
                ? userEmail
                : "Sin sesion"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-24 rounded-md bg-slate-100" />
          ) : isAuthed ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-slate-300"
              >
                <span className="hidden sm:block">
                  {userName} {userLastName}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Inicio
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch(setAuthModalOpen({ open: true, tab: "register" }))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-slate-300"
              >
                Registrarse
              </button>
              <button
                type="button"
                onClick={() => dispatch(setAuthModalOpen({ open: true, tab: "login" }))}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
              >
                Iniciar sesion
              </button>
            </div>
          )}
          <AudioPanel />
          <MemoryMenu />
        </div>
      </header>
      <AuthModal />
      <ResetPasswordModal />
    </>
  )
}
