import { LogOut, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { logout } from "../services/authService";
import { getUserSettings, updateUserSettings } from "../services/settingsService";
import { seedDemoData } from "../services/seedData";
import { defaultTimezone } from "../types/options";

export function SettingsPage() {
  const { user } = useAuth();
  const notify = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [settings, setSettings] = useState({ brandName: "Dare & Rise", timezone: defaultTimezone });

  useEffect(() => {
    if (!user) return;
    getUserSettings(user.uid)
      .then(setSettings)
      .catch((error) => {
        console.error(error);
        notify("Unable to load settings.", "error");
      })
      .finally(() => setLoading(false));
  }, [notify, user]);

  if (loading) return <LoadingState label="Loading settings" />;

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserSettings(user.uid, settings);
      notify("Settings saved.", "success");
    } catch (error) {
      console.error(error);
      notify("Unable to save settings.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function seed() {
    if (!user) return;
    setSeeding(true);
    try {
      await seedDemoData(user.uid);
      notify("Demo data added.", "success");
    } catch (error) {
      console.error(error);
      notify("Unable to add demo data.", "error");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Account, app information and defaults for the Phase 1 planner." />
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="text-lg font-extrabold">Google Account</h2>
          <div className="mt-5 flex items-center gap-3">
            {user?.photoURL && <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full" />}
            <div className="min-w-0">
              <p className="truncate font-extrabold">{user?.displayName}</p>
              <p className="truncate text-sm font-semibold text-ink/50">{user?.email}</p>
            </div>
          </div>
          <Button className="mt-5 w-full" variant="secondary" icon={<LogOut size={17} />} onClick={() => void logout()}>
            Logout
          </Button>
        </section>

        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="text-lg font-extrabold">Brand Defaults</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input label="Brand Name" value={settings.brandName} onChange={(event) => setSettings({ ...settings, brandName: event.target.value })} />
            <Input label="Default Timezone" value={settings.timezone} onChange={(event) => setSettings({ ...settings, timezone: event.target.value })} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={save} isLoading={saving}>Save Settings</Button>
            <Button variant="secondary" onClick={seed} isLoading={seeding} icon={<Sparkles size={17} />}>Add Demo Data</Button>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/55">
            Demo data is optional and added only when this button is clicked. It creates sample products, campaigns and content items for development.
          </p>
        </section>

        <section className="rounded-xl border border-line bg-white p-5 lg:col-span-2">
          <h2 className="text-lg font-extrabold">Phase 1 Scope</h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-ink/60 sm:grid-cols-2 lg:grid-cols-4">
            <p>Instagram and Facebook planning</p>
            <p>Google Drive URL references only</p>
            <p>No media uploads or Firebase Storage</p>
            <p>No Meta publishing integration</p>
          </div>
        </section>
      </div>
    </div>
  );
}
