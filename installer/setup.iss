; ============================================
; Durrani Welfare Trust - Management System
; Inno Setup Installer Script
; ============================================

#define MyAppName "DWT Management System"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Durrani Welfare & Social Development Organization"
#define MyAppExeName "DWT Management System.exe"
#define MyAppURL "https://www.dwtrust.org"

[Setup]
; Basic installer info
AppId={{A3D8E7F1-5B2C-4D6A-9E1F-3C8B7A2D5E4F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} v{#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}

; Default install location (user can change during setup)
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}

; Installer output
OutputDir=..\installer_output
OutputBaseFilename=DWT_Management_System_Setup_v{#MyAppVersion}

; Compression
Compression=lzma2/ultra64
SolidCompression=yes

; Installer appearance
WizardStyle=modern
SetupIconFile=..\static\img\logo\app_icon.ico

; Privileges
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog

; Allow user to select directory
AllowNoIcons=yes
DisableDirPage=no
DisableProgramGroupPage=yes

; Uninstaller
UninstallDisplayIcon={app}\{#MyAppExeName}
UninstallDisplayName={#MyAppName}

; Versioning
VersionInfoVersion={#MyAppVersion}.0
VersionInfoCompany={#MyAppPublisher}
VersionInfoDescription=Durrani Welfare Trust Management System
VersionInfoProductName={#MyAppName}
VersionInfoProductVersion={#MyAppVersion}

; Misc
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
ShowLanguageDialog=auto

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
; Main application executable
Source: "..\dist\DWT Management System\DWT Management System.exe"; DestDir: "{app}"; Flags: ignoreversion

; Internal directory (all bundled dependencies)
Source: "..\dist\DWT Management System\_internal\*"; DestDir: "{app}\_internal"; Flags: ignoreversion recursesubdirs createallsubdirs

; Application icon file (for shortcuts)
Source: "..\static\img\logo\app_icon.ico"; DestDir: "{app}"; Flags: ignoreversion

; Media directory (for profile images and uploads)
Source: "..\dist\DWT Management System\media\*"; DestDir: "{app}\media"; Flags: ignoreversion recursesubdirs createallsubdirs skipifsourcedoesntexist onlyifdoesntexist

[Dirs]
; Create directories for runtime data
Name: "{app}\media"; Permissions: users-modify
Name: "{app}\media\staff"; Permissions: users-modify
Name: "{app}\media\students"; Permissions: users-modify
Name: "{app}\media\profile_images"; Permissions: users-modify
Name: "{app}\backups"; Permissions: users-modify

[Icons]
; Start Menu shortcut
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\app_icon.ico"; Comment: "Launch Durrani Welfare Trust Management System"
Name: "{group}\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"; Comment: "Uninstall {#MyAppName}"

; Desktop shortcut with DWT icon
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\app_icon.ico"; Tasks: desktopicon; Comment: "Launch Durrani Welfare Trust Management System"

[Run]
; Option to launch application after install
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; Clean up runtime files on uninstall
Type: filesandordirs; Name: "{app}\media"
Type: files; Name: "{app}\app_icon.ico"
Type: files; Name: "{app}\.dwt_running.lock"
; Data stored in AppData
Type: filesandordirs; Name: "{localappdata}\DWT Management System"

[Messages]
WelcomeLabel2=This will install [name/ver] on your computer.%n%nThe system includes:%n  - Student Management%n  - Staff Management%n  - Volunteer Management%n  - Driver Management%n  - Ambulance Service%n  - Community Projects%n  - Financial Management%n  - Reports & Analytics%n%nIt is recommended that you close all other applications before continuing.
FinishedLabel=Setup has completed installing [name] on your computer.%n%nDefault Login Credentials:%n  Username: admin%n  Password: admin123%n%nPlease change your password after first login.

[Code]
// Custom code to handle first-run setup messages
procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    // Log successful installation
    Log('DWT Management System installed successfully.');
  end;
end;
