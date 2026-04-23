import { createBrowserRouter } from 'react-router';
import { SplashScreen } from './components/screens/SplashScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { VehicleLookupScreen } from './components/screens/VehicleLookupScreen';
import { LocationPermissionScreen, NotificationPermissionScreen, OnboardingSuccessScreen } from './components/screens/PermissionScreens';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { RouteInputScreen } from './components/screens/RouteInputScreen';
import { CompareRoutesScreen } from './components/screens/CompareRoutesScreen';
import { DriveScreen } from './components/screens/DriveScreen';
import { ZonesScreen } from './components/screens/ZonesScreen';
import { ZoneDetailScreen } from './components/screens/ZoneDetailScreen';
import { TripHistoryScreen } from './components/screens/TripHistoryScreen';
import { TripDetailScreen } from './components/screens/TripDetailScreen';
import { SavingsScreen } from './components/screens/SavingsScreen';
import { VehicleDetailsScreen } from './components/screens/VehicleDetailsScreen';
import { BookMOTScreen } from './components/screens/BookMOTScreen';
import { AddVehicleScreen } from './components/screens/AddVehicleScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { FleetScreen } from './components/screens/FleetScreen';
import { PilotDemoScreen } from './components/screens/PilotDemoScreen';
import { PCNDefenceScreen, PCNDetailScreen, PCNNewCaseScreen, PCNWeakScreen, PCNRejectedScreen, PCNWithdrawnScreen } from './components/screens/PCNDefenceScreen';
import { MileageScreen } from './components/screens/MileageScreen';
import { TollScoreScreen } from './components/screens/TollScoreScreen';
import { DailyCommuteScreen } from './components/screens/DailyCommuteScreen';
import { ParkingScreen } from './components/screens/ParkingScreen';
import { DebugTodayScreen } from './components/screens/DebugTodayScreen';
import { DebugMenuScreen } from './components/screens/DebugMenuScreen';
import {
  ForgotPasswordScreen, ResetPasswordScreen, SupportScreen,
  PrivacyScreen, TermsScreen, DeleteAccountScreen,
  OfflineScreen, ErrorScreen, NotFoundScreen
} from './components/screens/AccountAndLegalScreens';
import { WalletScreen } from './components/screens/WalletScreen';
import { WidgetScreen } from './components/screens/WidgetScreen';
import {
  SettingsScreen, ProfileScreen, AlertSettingsScreen, HelpCentreScreen, AboutScreen
} from './components/screens/SettingsAndMoreScreens';
import {
  ProUpgradeScreen, ReferralScreen, PaymentConfirmationScreen, ZoneEnteredScreen,
  FleetDriverDetailScreen, RouteCostByDriverScreen
} from './components/screens/ProAndReferralScreens';

export const router = createBrowserRouter([
  { path: '/', Component: SplashScreen },
  { path: '/auth', Component: AuthScreen },
  { path: '/onboarding', Component: OnboardingScreen },
  { path: '/lookup', Component: VehicleLookupScreen },
  { path: '/permission/location', Component: LocationPermissionScreen },
  { path: '/permission/notifications', Component: NotificationPermissionScreen },
  { path: '/onboarding/success', Component: OnboardingSuccessScreen },
  { path: '/dashboard', Component: DashboardScreen },
  { path: '/route', Component: RouteInputScreen },
  { path: '/compare', Component: CompareRoutesScreen },
  { path: '/drive', Component: DriveScreen },
  { path: '/zones', Component: ZonesScreen },
  { path: '/zones/:id', Component: ZoneDetailScreen },
  { path: '/zone-entered', Component: ZoneEnteredScreen },
  { path: '/trips', Component: TripHistoryScreen },
  { path: '/trips/:id', Component: TripDetailScreen },
  { path: '/savings', Component: SavingsScreen },
  { path: '/vehicle', Component: VehicleDetailsScreen },
  { path: '/vehicle/add', Component: AddVehicleScreen },
  { path: '/book-mot', Component: BookMOTScreen },
  { path: '/notifications', Component: NotificationsScreen },
  { path: '/fleet', Component: FleetScreen },
  { path: '/fleet/routes', Component: RouteCostByDriverScreen },
  { path: '/fleet/:id', Component: FleetDriverDetailScreen },
  { path: '/settings', Component: SettingsScreen },
  { path: '/profile', Component: ProfileScreen },
  { path: '/alerts', Component: AlertSettingsScreen },
  { path: '/pro', Component: ProUpgradeScreen },
  { path: '/help', Component: HelpCentreScreen },
  { path: '/about', Component: AboutScreen },
  { path: '/payment', Component: PaymentConfirmationScreen },
  { path: '/referral', Component: ReferralScreen },
  { path: '/pilot-demo', Component: PilotDemoScreen },
  { path: '/pcn', Component: PCNDefenceScreen },
  { path: '/pcn/new', Component: PCNNewCaseScreen },
  { path: '/pcn/:id', Component: PCNDetailScreen },
  { path: '/pcn/:id/weak', Component: PCNWeakScreen },
  { path: '/pcn/:id/rejected', Component: PCNRejectedScreen },
  { path: '/pcn/:id/withdrawn', Component: PCNWithdrawnScreen },
  { path: '/mileage', Component: MileageScreen },
  { path: '/tollscore', Component: TollScoreScreen },
  { path: '/daily-commute', Component: DailyCommuteScreen },
  { path: '/parking', Component: ParkingScreen },
  { path: '/debug', Component: DebugMenuScreen },
  { path: '/debug/today', Component: DebugTodayScreen },
  { path: '/wallet', Component: WalletScreen },
  { path: '/widget', Component: WidgetScreen },
  // Account
  { path: '/auth/forgot', Component: ForgotPasswordScreen },
  { path: '/auth/reset', Component: ResetPasswordScreen },
  { path: '/account/delete', Component: DeleteAccountScreen },
  // Support + Legal
  { path: '/support', Component: SupportScreen },
  { path: '/legal/privacy', Component: PrivacyScreen },
  { path: '/legal/terms', Component: TermsScreen },
  // Status
  { path: '/offline', Component: OfflineScreen },
  { path: '/error', Component: ErrorScreen },
  // 404 catch-all — must stay last
  { path: '*', Component: NotFoundScreen },
]);