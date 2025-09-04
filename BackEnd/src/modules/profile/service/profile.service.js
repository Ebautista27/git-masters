// src/modules/profile/service/profile.service.js
const fs = require('fs');
const path = require('path');

// Si quieres que no dependa del cwd, hazlo relativo al archivo:
const dbPath = path.resolve(__dirname, '../../../..', 'database.json');
// (Tu version con process.cwd() también sirve si arrancas desde BackEnd)

async function readDb() {
  try {
    const data = await fs.promises.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      users: [], profiles: [], metrics: [], badges: [],
      badgeAssignments: [], teams: [], activityLogs: [],
      rules: [], github_events: []
    };
  }
}

async function getUserProfileData(githubId) {
  const db = await readDb();

  // 🔑 Normaliza ambos a string
  const user = db.users.find(u => String(u.githubId) === String(githubId));
  if (!user) return null;

  const profile = db.profiles.find(p => p.userId === user.id) || {};
  const metrics = db.metrics.find(m => m.userId === user.id) || { commits: 0, prs: 0, points: 0, branches: 0 };
  const assignedBadges = db.badgeAssignments
    .filter(ba => ba.userId === user.id)
    .map(ba => {
      const badge = db.badges.find(b => b.id === ba.badgeId);
      return badge ? { ...badge, obtainedAt: ba.obtainedAt } : null;
    })
    .filter(Boolean);

  const team = user.teamId ? db.teams.find(t => t.id === user.teamId) : null;
  const activityLogs = db.activityLogs.filter(a => a.userId === user.id);

  return {
    id: user.id,
    githubId: user.githubId,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    team: team ? { id: team.id, name: team.name } : null,
    profile: {
      level: profile.level ?? null,
      bio: profile.bio ?? null,
      recentActivity: profile.recentActivity ?? null,
    },
    metrics: {
      points: metrics.points ?? 0,
      commits: metrics.commits ?? 0,
      prs: metrics.prs ?? 0,
      branches: metrics.branches ?? 0,
    },
    badges: assignedBadges,
    activityLogs,
  };
}

module.exports = { getUserProfileData };
