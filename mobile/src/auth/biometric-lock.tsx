import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState, AppStateStatus, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../constants/colors";

const REAUTH_TIMEOUT_MS = 60 * 60 * 1000;

type LockContextValue = {
  lockNow: () => void;
  isUnlocked: boolean;
};

const LockContext = createContext<LockContextValue | null>(null);

export function useBiometricLock() {
  const context = useContext(LockContext);

  if (!context) {
    throw new Error("useBiometricLock must be used within BiometricLockProvider");
  }

  return context;
}

export function BiometricLockProvider({ children }: { children: React.ReactNode }) {
  const appState = useRef(AppState.currentState);
  const backgroundedAtRef = useRef<number | null>(null);
  const authInProgressRef = useRef(false);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(true);

  const authenticate = useCallback(async () => {
    if (authInProgressRef.current) {
      return false;
    }

    authInProgressRef.current = true;
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setIsBiometricAvailable(false);
        setIsUnlocked(false);
        setAuthError("Configura huella o biometria en el dispositivo para entrar a la app.");
        return false;
      }

      setIsBiometricAvailable(true);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Desbloquear consultorio",
        cancelLabel: "Cancelar",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsUnlocked(true);
        setAuthError(null);
        backgroundedAtRef.current = null;
        return true;
      }

      setIsUnlocked(false);
      setAuthError("No se pudo validar tu identidad. Intenta nuevamente.");
      return false;
    } catch {
      setIsUnlocked(false);
      setAuthError("No se pudo iniciar la autenticacion biometrica.");
      return false;
    } finally {
      authInProgressRef.current = false;
      setIsAuthenticating(false);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextState: AppStateStatus) => {
      const previousState = appState.current;

      if (nextState === "background" || nextState === "inactive") {
        backgroundedAtRef.current = Date.now();
      }

      if (previousState.match(/inactive|background/) && nextState === "active") {
        const lastBackgroundAt = backgroundedAtRef.current;

        if (lastBackgroundAt && Date.now() - lastBackgroundAt >= REAUTH_TIMEOUT_MS) {
          setIsUnlocked(false);
          await authenticate();
        }
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [authenticate]);

  const lockNow = useCallback(() => {
    backgroundedAtRef.current = Date.now() - REAUTH_TIMEOUT_MS;
    setIsUnlocked(false);
  }, []);

  const value = useMemo(
    () => ({
      lockNow,
      isUnlocked,
    }),
    [isUnlocked, lockNow]
  );

  return (
    <LockContext.Provider value={value}>
      {children}

      {(!isReady || !isUnlocked) && (
        <SafeAreaView style={styles.overlay} edges={["top", "left", "right", "bottom"]}>
          <StatusBar style="light" backgroundColor={COLORS.primary} />

          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name="finger-print-outline" size={40} color="#fff" />
            </View>

            <Text style={styles.title}>Consultorio protegido</Text>
            <Text style={styles.text}>
              {isBiometricAvailable
                ? "Usa tu huella o biometria para ingresar. La app volvera a pedir validacion despues de una hora de inactividad."
                : "Este dispositivo no tiene biometria configurada para proteger la app."}
            </Text>

            {authError ? <Text style={styles.error}>{authError}</Text> : null}

            <TouchableOpacity
              style={[styles.button, isAuthenticating ? styles.buttonDisabled : null]}
              activeOpacity={0.85}
              onPress={() => {
                authenticate();
              }}
              disabled={isAuthenticating}
            >
              <Text style={styles.buttonText}>
                {isAuthenticating ? "Verificando..." : isBiometricAvailable ? "Desbloquear" : "Reintentar"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </LockContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  iconWrap: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    color: "#ffe3e8",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 14,
  },
  error: {
    color: "#fff3b0",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 14,
  },
  button: {
    minHeight: 54,
    minWidth: 180,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "800",
  },
});
