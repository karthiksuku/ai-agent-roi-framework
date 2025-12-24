"""
Command-line interface for AURA Framework.

Provides commands for calculating ROI, generating reports,
and running interactive sessions.
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Optional

from .models import Project, Task, CostStructure, RiskProfile, Industry
from .calculator import AURACalculator
from .industry_presets import IndustryPresets, get_industry_preset


def main():
    """Main entry point for the CLI."""
    parser = argparse.ArgumentParser(
        prog='aura',
        description='AURA Framework - AI Utility & Return Assessment Calculator',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  aura calculate --input scenario.json --output results.json
  aura report --input scenario.json --format markdown
  aura interactive
  aura presets --industry healthcare

For more information, visit: https://github.com/your-username/ai-agent-roi-framework
        """
    )

    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Calculate command
    calc_parser = subparsers.add_parser('calculate', help='Calculate ROI from scenario file')
    calc_parser.add_argument('--input', '-i', required=True, help='Input scenario JSON file')
    calc_parser.add_argument('--output', '-o', help='Output results JSON file')
    calc_parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    # Report command
    report_parser = subparsers.add_parser('report', help='Generate ROI report')
    report_parser.add_argument('--input', '-i', required=True, help='Input scenario JSON file')
    report_parser.add_argument('--output', '-o', help='Output report file')
    report_parser.add_argument('--format', '-f', choices=['markdown', 'html', 'json'],
                               default='markdown', help='Report format')

    # Interactive command
    interactive_parser = subparsers.add_parser('interactive', help='Interactive ROI calculation')
    interactive_parser.add_argument('--industry', help='Start with industry preset')

    # Presets command
    presets_parser = subparsers.add_parser('presets', help='Show industry presets')
    presets_parser.add_argument('--industry', help='Show specific industry preset')
    presets_parser.add_argument('--list', action='store_true', help='List all industries')

    # Validate command
    validate_parser = subparsers.add_parser('validate', help='Validate scenario file')
    validate_parser.add_argument('--input', '-i', required=True, help='Scenario file to validate')

    args = parser.parse_args()

    if args.command is None:
        parser.print_help()
        sys.exit(0)

    try:
        if args.command == 'calculate':
            cmd_calculate(args)
        elif args.command == 'report':
            cmd_report(args)
        elif args.command == 'interactive':
            cmd_interactive(args)
        elif args.command == 'presets':
            cmd_presets(args)
        elif args.command == 'validate':
            cmd_validate(args)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


def cmd_calculate(args):
    """Execute calculate command."""
    # Load scenario
    with open(args.input, 'r') as f:
        scenario_data = json.load(f)

    # Create project from scenario
    project = Project.from_dict(scenario_data)

    # Calculate
    calculator = AURACalculator(project)
    results = calculator.calculate()

    # Output results
    output_data = results.to_dict()

    if args.output:
        with open(args.output, 'w') as f:
            json.dump(output_data, f, indent=2)
        print(f"Results written to {args.output}")
    else:
        print_results_summary(results, verbose=args.verbose)


def cmd_report(args):
    """Execute report command."""
    # Load scenario
    with open(args.input, 'r') as f:
        scenario_data = json.load(f)

    project = Project.from_dict(scenario_data)
    calculator = AURACalculator(project)
    results = calculator.calculate()

    if args.format == 'json':
        report = results.to_json(indent=2)
    elif args.format == 'html':
        report = generate_html_report(results)
    else:  # markdown
        report = generate_markdown_report(results)

    if args.output:
        with open(args.output, 'w') as f:
            f.write(report)
        print(f"Report written to {args.output}")
    else:
        print(report)


def cmd_interactive(args):
    """Execute interactive command."""
    print("\n" + "="*60)
    print("  AURA Framework - Interactive ROI Calculator")
    print("  AI Utility & Return Assessment")
    print("="*60 + "\n")

    # Get project name
    project_name = input("Project name: ").strip() or "AI Agent Project"

    # Get industry
    print("\nAvailable industries:")
    industries = IndustryPresets.list_industries()
    for i, ind in enumerate(industries, 1):
        print(f"  {i}. {ind}")

    while True:
        try:
            choice = input("\nSelect industry (1-{}): ".format(len(industries))).strip()
            if choice.isdigit() and 1 <= int(choice) <= len(industries):
                industry = Industry(industries[int(choice) - 1])
                break
        except (ValueError, KeyError):
            pass
        print("Invalid choice. Please try again.")

    preset = IndustryPresets.get(industry)
    print(f"\nUsing {preset.name} industry preset:")
    print(f"  - Typical hourly rate: ${preset.typical_hourly_rate}")
    print(f"  - Typical accuracy: {preset.typical_accuracy * 100:.0f}%")
    print(f"  - Typical oversight: {preset.typical_oversight_rate * 100:.0f}%")

    # Get duration
    duration = input("\nProject duration in months (default: 24): ").strip()
    duration = int(duration) if duration.isdigit() else 24

    # Create project
    project = Project(
        name=project_name,
        duration_months=duration,
        industry=industry,
        risk_profile=preset.risk_profile,
        maturity_config=preset.maturity_config,
    )

    # Add tasks
    print("\n" + "-"*40)
    print("Add tasks (enter blank name to finish)")
    print("-"*40)

    task_num = 1
    while True:
        print(f"\nTask {task_num}:")
        name = input("  Task name (blank to finish): ").strip()
        if not name:
            break

        hours = input(f"  Hours per week (default: 40): ").strip()
        hours = float(hours) if hours else 40.0

        rate = input(f"  Hourly rate (default: ${preset.typical_hourly_rate}): $").strip()
        rate = float(rate) if rate else preset.typical_hourly_rate

        accuracy = input(f"  AI accuracy % (default: {preset.typical_accuracy * 100:.0f}): ").strip()
        accuracy = float(accuracy) / 100 if accuracy else preset.typical_accuracy

        project.add_task(Task(
            name=name,
            hours_per_week=hours,
            hourly_rate=rate,
            accuracy=accuracy,
            oversight_rate=preset.typical_oversight_rate,
        ))
        task_num += 1

    if not project.tasks:
        print("\nNo tasks added. Using example task.")
        project.add_task(Task(
            name="Example Task",
            hours_per_week=40,
            hourly_rate=preset.typical_hourly_rate,
            accuracy=preset.typical_accuracy,
        ))

    # Get costs
    print("\n" + "-"*40)
    print("Cost Configuration")
    print("-"*40)

    use_defaults = input("\nUse typical costs for this industry? (Y/n): ").strip().lower()
    if use_defaults != 'n':
        project.costs = IndustryPresets.get_typical_costs(industry, "medium")
        print("Using typical medium-scale costs.")
    else:
        initial = input("Initial development cost: $").strip()
        platform = input("Monthly platform cost: $").strip()
        project.costs = CostStructure(
            initial_development=float(initial) if initial else 50000,
            platform_monthly=float(platform) if platform else 2500,
        )

    # Calculate
    print("\n" + "="*60)
    print("  Calculating ROI...")
    print("="*60)

    calculator = AURACalculator(project)
    results = calculator.calculate()

    print_results_summary(results, verbose=True)

    # Offer to save
    save = input("\nSave scenario to file? (y/N): ").strip().lower()
    if save == 'y':
        filename = input("Filename (default: scenario.json): ").strip() or "scenario.json"
        with open(filename, 'w') as f:
            json.dump(project.to_dict(), f, indent=2)
        print(f"Saved to {filename}")


def cmd_presets(args):
    """Execute presets command."""
    if args.list:
        print("\nAvailable Industries:")
        print("-" * 40)
        for industry in IndustryPresets.list_industries():
            preset = get_industry_preset(industry)
            if preset:
                print(f"  {industry:20} - {preset.name}")
        return

    if args.industry:
        preset = get_industry_preset(args.industry)
        if preset:
            print(f"\n{preset.name} Industry Preset")
            print("=" * 50)
            print(f"\nDescription: {preset.description}")
            print(f"\nTypical Parameters:")
            print(f"  - Hourly Rate: ${preset.typical_hourly_rate}")
            print(f"  - AI Accuracy: {preset.typical_accuracy * 100:.0f}%")
            print(f"  - Oversight Rate: {preset.typical_oversight_rate * 100:.0f}%")
            print(f"  - Learning Rate: {preset.learning_rate * 100:.1f}% per month")
            print(f"\nRisk Profile:")
            print(f"  - Technical Risk: {preset.risk_profile.technical_risk * 100:.0f}%")
            print(f"  - Adoption Risk: {preset.risk_profile.adoption_risk * 100:.0f}%")
            print(f"  - Regulatory Risk: {preset.risk_profile.regulatory_risk * 100:.0f}%")
            print(f"  - Vendor Risk: {preset.risk_profile.vendor_risk * 100:.0f}%")
            print(f"\nTypical Tasks:")
            for task in preset.typical_tasks[:5]:
                print(f"  - {task}")
            print(f"\nRegulatory Considerations:")
            print(f"  {preset.regulatory_considerations}")
        else:
            print(f"Unknown industry: {args.industry}")
            print("Use --list to see available industries")
    else:
        print("Specify --industry <name> or --list")


def cmd_validate(args):
    """Execute validate command."""
    try:
        with open(args.input, 'r') as f:
            data = json.load(f)

        project = Project.from_dict(data)

        print(f"✓ Valid scenario file: {args.input}")
        print(f"  Project: {project.name}")
        print(f"  Duration: {project.duration_months} months")
        print(f"  Tasks: {len(project.tasks)}")
        print(f"  Industry: {project.industry.value}")

    except json.JSONDecodeError as e:
        print(f"✗ Invalid JSON: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Validation error: {e}")
        sys.exit(1)


def print_results_summary(results, verbose=False):
    """Print results summary to console."""
    print("\n" + "="*60)
    print(f"  ROI ANALYSIS: {results.project_name}")
    print("="*60)

    print(f"\n{'SUMMARY':^60}")
    print("-"*60)
    print(f"  Duration:              {results.duration_months} months")
    print(f"  Total Gross Value:     ${results.total_gross_value:>15,.0f}")
    print(f"  Risk-Adjusted Value:   ${results.total_risk_adjusted_value:>15,.0f}")
    print(f"  Total Cost:            ${results.total_cost:>15,.0f}")
    print(f"  Net Present Value:     ${results.net_present_value:>15,.0f}")
    print(f"  ROI:                   {results.roi_percentage:>14.1f}%")
    if results.payback_months:
        print(f"  Payback Period:        {results.payback_months:>11.1f} months")
    if results.irr:
        print(f"  IRR:                   {results.irr:>14.1f}%")

    if verbose:
        print(f"\n{'VALUE BREAKDOWN (Monthly)':^60}")
        print("-"*60)
        breakdown = results.value_breakdown
        print(f"  Direct Labour Arbitrage:  ${breakdown.dla:>12,.0f}")
        print(f"  Throughput Amplification: ${breakdown.ta:>12,.0f}")
        print(f"  Decision Quality Premium: ${breakdown.dqp:>12,.0f}")
        print(f"  Latency Value:            ${breakdown.lv:>12,.0f}")
        print(f"  Optionality & Learning:   ${breakdown.olv:>12,.0f}")
        print(f"  {'─'*40}")
        print(f"  Total Monthly Value:      ${breakdown.total:>12,.0f}")

        print(f"\n{'RISK PROFILE':^60}")
        print("-"*60)
        risk = results.risk_profile
        print(f"  Technical Risk:    {risk.technical_risk * 100:>5.1f}%")
        print(f"  Adoption Risk:     {risk.adoption_risk * 100:>5.1f}%")
        print(f"  Regulatory Risk:   {risk.regulatory_risk * 100:>5.1f}%")
        print(f"  Vendor Risk:       {risk.vendor_risk * 100:>5.1f}%")
        print(f"  Composite Risk:    {risk.composite_risk * 100:>5.1f}%")
        print(f"  Risk Adjustment:   {risk.risk_adjustment_factor * 100:>5.1f}%")

    print("\n" + "="*60 + "\n")


def generate_markdown_report(results) -> str:
    """Generate markdown report."""
    lines = [
        f"# AURA ROI Analysis: {results.project_name}",
        "",
        "## Executive Summary",
        "",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Duration | {results.duration_months} months |",
        f"| Net Present Value | ${results.net_present_value:,.0f} |",
        f"| ROI | {results.roi_percentage:.1f}% |",
        f"| Payback Period | {results.payback_months:.1f} months |" if results.payback_months else "",
        "",
        "## Value Breakdown",
        "",
        "| Dimension | Monthly Value | % of Total |",
        "|-----------|---------------|------------|",
    ]

    breakdown = results.value_breakdown
    total = breakdown.total if breakdown.total > 0 else 1

    for name, value in [
        ("Direct Labour Arbitrage", breakdown.dla),
        ("Throughput Amplification", breakdown.ta),
        ("Decision Quality Premium", breakdown.dqp),
        ("Latency Value", breakdown.lv),
        ("Optionality & Learning", breakdown.olv),
    ]:
        pct = (value / total) * 100
        lines.append(f"| {name} | ${value:,.0f} | {pct:.1f}% |")

    lines.extend([
        f"| **Total** | **${total:,.0f}** | **100%** |",
        "",
        "## Risk Profile",
        "",
        f"| Risk Type | Score |",
        f"|-----------|-------|",
        f"| Technical | {results.risk_profile.technical_risk * 100:.1f}% |",
        f"| Adoption | {results.risk_profile.adoption_risk * 100:.1f}% |",
        f"| Regulatory | {results.risk_profile.regulatory_risk * 100:.1f}% |",
        f"| Vendor | {results.risk_profile.vendor_risk * 100:.1f}% |",
        f"| **Composite** | **{results.risk_profile.composite_risk * 100:.1f}%** |",
        "",
        "---",
        "",
        "*Generated by AURA Framework*",
    ])

    return "\n".join(lines)


def generate_html_report(results) -> str:
    """Generate HTML report."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AURA ROI Analysis: {results.project_name}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
        h1 {{ color: #1e40af; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
        th {{ background-color: #f8fafc; }}
        .metric {{ font-size: 24px; font-weight: bold; color: #16a34a; }}
        .section {{ margin: 30px 0; }}
    </style>
</head>
<body>
    <h1>AURA ROI Analysis: {results.project_name}</h1>

    <div class="section">
        <h2>Executive Summary</h2>
        <table>
            <tr><td>Duration</td><td>{results.duration_months} months</td></tr>
            <tr><td>Net Present Value</td><td class="metric">${results.net_present_value:,.0f}</td></tr>
            <tr><td>ROI</td><td class="metric">{results.roi_percentage:.1f}%</td></tr>
            <tr><td>Payback Period</td><td>{results.payback_months:.1f if results.payback_months else 'N/A'} months</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Value Breakdown</h2>
        <table>
            <tr><th>Dimension</th><th>Monthly Value</th></tr>
            <tr><td>Direct Labour Arbitrage</td><td>${results.value_breakdown.dla:,.0f}</td></tr>
            <tr><td>Throughput Amplification</td><td>${results.value_breakdown.ta:,.0f}</td></tr>
            <tr><td>Decision Quality Premium</td><td>${results.value_breakdown.dqp:,.0f}</td></tr>
            <tr><td>Latency Value</td><td>${results.value_breakdown.lv:,.0f}</td></tr>
            <tr><td>Optionality & Learning</td><td>${results.value_breakdown.olv:,.0f}</td></tr>
            <tr><th>Total</th><th>${results.value_breakdown.total:,.0f}</th></tr>
        </table>
    </div>

    <footer>
        <p><em>Generated by AURA Framework</em></p>
    </footer>
</body>
</html>"""


if __name__ == '__main__':
    main()
