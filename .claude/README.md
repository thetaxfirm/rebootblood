# Claude Code configuration

## Karpathy guidelines

Behavioral guidelines to reduce common LLM coding mistakes, from
<https://github.com/multica-ai/andrej-karpathy-skills> (MIT).

They are wired up two ways, because the two environments load them differently:

- **`settings.json`** registers the `karpathy-skills` marketplace and enables the
  `andrej-karpathy-skills` plugin. This is the equivalent of running
  `/plugin marketplace add` + `/plugin install`, which the CLI plugin manager
  applies on its own. Local CLI users may still need
  `claude plugin install andrej-karpathy-skills@karpathy-skills` once, since
  Claude Code does not auto-install plugins from external sources.
- **`skills/karpathy-guidelines/SKILL.md`** is a verbatim copy of the plugin's
  only skill. Cloud sessions (claude.ai/code) have no plugin manager, so the
  vendored copy is what actually loads there.

Users who install the plugin get both, under different names
(`karpathy-guidelines` and `andrej-karpathy-skills:karpathy-guidelines`). If that
duplication is unwanted, drop whichever half does not match how the team runs
Claude Code. To refresh the vendored copy, re-copy `SKILL.md` from upstream.
