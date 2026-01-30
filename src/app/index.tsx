import { useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { Pedometer } from "expo-sensors";
import * as AC from "@bacons/apple-colors";

export default function IndexRoute() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [currentSteps, setCurrentSteps] = useState(0);
  const [pastStepCount, setPastStepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      const result = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(result));

      if (result) {
        // Get steps from the past 24 hours
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        const pastSteps = await Pedometer.getStepCountAsync(start, end);
        if (pastSteps) {
          setPastStepCount(pastSteps.steps);
        }
      }
    };
    checkAvailability();
  }, []);

  const startTracking = () => {
    setCurrentSteps(0);
    setIsTracking(true);

    const subscription = Pedometer.watchStepCount((result) => {
      setCurrentSteps(result.steps);
    });

    return () => {
      subscription.remove();
    };
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const resetCounter = () => {
    setCurrentSteps(0);
  };

  useEffect(() => {
    if (isTracking) {
      const cleanup = startTracking();
      return cleanup;
    }
  }, [isTracking]);

  if (isPedometerAvailable === "checking") {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
      >
        <View style={{ padding: 20, alignItems: "center", marginTop: 100 }}>
          <Text style={{ fontSize: 18, color: AC.secondaryLabel }}>
            Checking pedometer availability...
          </Text>
        </View>
      </ScrollView>
    );
  }

  if (isPedometerAvailable === "false") {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
      >
        <View style={{ padding: 20, alignItems: "center", marginTop: 100 }}>
          <Text style={{ fontSize: 18, color: AC.systemRed, textAlign: "center" }}>
            Pedometer is not available on this device
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1 }}
    >
      <View style={{ padding: 20, gap: 30, paddingTop: 40 }}>
        {/* Main Step Counter */}
        <View
          style={{
            backgroundColor: AC.systemBackground,
            borderRadius: 20,
            borderCurve: "continuous",
            padding: 30,
            alignItems: "center",
            gap: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Text style={{ fontSize: 20, color: AC.secondaryLabel, fontWeight: "600" }}>
            Current Steps
          </Text>
          <Text
            selectable
            style={{
              fontSize: 72,
              fontWeight: "700",
              color: AC.systemBlue,
              fontVariant: "tabular-nums",
            }}
          >
            {currentSteps.toLocaleString()}
          </Text>
          <Text style={{ fontSize: 16, color: AC.tertiaryLabel }}>
            {isTracking ? "Tracking active" : "Tracking paused"}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={{ gap: 12 }}>
          <Pressable
            onPress={() => {
              if (isTracking) {
                stopTracking();
              } else {
                setIsTracking(true);
              }
            }}
            style={({ pressed }) => ({
              backgroundColor: isTracking ? AC.systemOrange : AC.systemGreen,
              borderRadius: 14,
              borderCurve: "continuous",
              padding: 18,
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
              {isTracking ? "Pause Tracking" : "Start Tracking"}
            </Text>
          </Pressable>

          <Pressable
            onPress={resetCounter}
            style={({ pressed }) => ({
              backgroundColor: AC.systemRed,
              borderRadius: 14,
              borderCurve: "continuous",
              padding: 18,
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
              Reset Counter
            </Text>
          </Pressable>
        </View>

        {/* Past 24 Hours Stats */}
        <View
          style={{
            backgroundColor: AC.secondarySystemBackground,
            borderRadius: 16,
            borderCurve: "continuous",
            padding: 20,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 16, color: AC.secondaryLabel, fontWeight: "600" }}>
            Past 24 Hours
          </Text>
          <Text
            selectable
            style={{
              fontSize: 36,
              fontWeight: "700",
              color: AC.label,
              fontVariant: "tabular-nums",
            }}
          >
            {pastStepCount.toLocaleString()}
          </Text>
          <Text style={{ fontSize: 14, color: AC.tertiaryLabel }}>
            steps recorded
          </Text>
        </View>

        {/* Info Card */}
        <View
          style={{
            backgroundColor: AC.secondarySystemBackground,
            borderRadius: 16,
            borderCurve: "continuous",
            padding: 20,
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 16, color: AC.secondaryLabel, fontWeight: "600" }}>
            How it works
          </Text>
          <Text style={{ fontSize: 14, color: AC.label, lineHeight: 20 }}>
            This app uses your device's built-in pedometer sensor to count steps.
            Tap "Start Tracking" to begin counting your steps. The counter will
            continue running even when the app is in the background.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
