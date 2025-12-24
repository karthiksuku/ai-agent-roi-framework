"""
Visualization functions for AURA Framework.

This module provides charting and reporting functions
using matplotlib and plotly.
"""

from typing import Optional, List, Tuple, Any
import io
import base64

from .models import AURAResults, ValueBreakdown, MonthlyProjection


def _check_matplotlib():
    """Check if matplotlib is available."""
    try:
        import matplotlib
        return True
    except ImportError:
        return False


def _check_plotly():
    """Check if plotly is available."""
    try:
        import plotly
        return True
    except ImportError:
        return False


class AURAVisualizer:
    """
    Visualization generator for AURA results.

    Supports both matplotlib and plotly backends.

    Example:
        >>> from aura_roi import AURACalculator, Project, Task
        >>> project = Project(name="Test", duration_months=24)
        >>> project.add_task(Task("Task", 40, 35))
        >>> results = AURACalculator(project).calculate()
        >>> viz = AURAVisualizer(results)
        >>> fig = viz.value_breakdown_chart()
    """

    # Color palette
    COLORS = {
        "dla": "#2563eb",      # Blue
        "ta": "#16a34a",       # Green
        "dqp": "#dc2626",      # Red
        "lv": "#9333ea",       # Purple
        "olv": "#ea580c",      # Orange
        "cost": "#64748b",     # Slate
        "positive": "#22c55e", # Green
        "negative": "#ef4444", # Red
        "neutral": "#3b82f6",  # Blue
    }

    def __init__(self, results: AURAResults):
        """
        Initialize visualizer with results.

        Args:
            results: AURAResults from calculation
        """
        self.results = results

    def value_breakdown_chart(self, backend: str = "matplotlib") -> Any:
        """
        Create a value breakdown pie or donut chart.

        Args:
            backend: 'matplotlib' or 'plotly'

        Returns:
            Figure object (matplotlib Figure or plotly Figure)
        """
        if backend == "plotly" and _check_plotly():
            return self._value_breakdown_plotly()
        elif _check_matplotlib():
            return self._value_breakdown_matplotlib()
        else:
            raise ImportError("Neither matplotlib nor plotly is available")

    def _value_breakdown_matplotlib(self):
        """Create value breakdown chart with matplotlib."""
        import matplotlib.pyplot as plt

        breakdown = self.results.value_breakdown
        labels = []
        sizes = []
        colors = []

        dimension_data = [
            ("Direct Labour Arbitrage", breakdown.dla, self.COLORS["dla"]),
            ("Throughput Amplification", breakdown.ta, self.COLORS["ta"]),
            ("Decision Quality Premium", breakdown.dqp, self.COLORS["dqp"]),
            ("Latency Value", breakdown.lv, self.COLORS["lv"]),
            ("Optionality & Learning", breakdown.olv, self.COLORS["olv"]),
        ]

        for label, value, color in dimension_data:
            if value > 0:
                labels.append(label)
                sizes.append(value)
                colors.append(color)

        fig, ax = plt.subplots(figsize=(10, 8))

        wedges, texts, autotexts = ax.pie(
            sizes,
            labels=labels,
            colors=colors,
            autopct=lambda pct: f'${pct/100*sum(sizes):,.0f}\n({pct:.1f}%)',
            startangle=90,
            wedgeprops=dict(width=0.5),  # Donut chart
        )

        # Style the text
        for autotext in autotexts:
            autotext.set_fontsize(9)
            autotext.set_color('white')
            autotext.set_fontweight('bold')

        ax.set_title(
            f"Monthly Value Breakdown\n{self.results.project_name}",
            fontsize=14,
            fontweight='bold'
        )

        # Add center text
        center_text = f"Total Monthly\n${breakdown.total:,.0f}"
        ax.text(0, 0, center_text, ha='center', va='center',
                fontsize=12, fontweight='bold')

        plt.tight_layout()
        return fig

    def _value_breakdown_plotly(self):
        """Create value breakdown chart with plotly."""
        import plotly.graph_objects as go

        breakdown = self.results.value_breakdown

        labels = [
            "Direct Labour Arbitrage",
            "Throughput Amplification",
            "Decision Quality Premium",
            "Latency Value",
            "Optionality & Learning",
        ]
        values = [
            breakdown.dla,
            breakdown.ta,
            breakdown.dqp,
            breakdown.lv,
            breakdown.olv,
        ]
        colors = [
            self.COLORS["dla"],
            self.COLORS["ta"],
            self.COLORS["dqp"],
            self.COLORS["lv"],
            self.COLORS["olv"],
        ]

        # Filter out zero values
        filtered = [(l, v, c) for l, v, c in zip(labels, values, colors) if v > 0]
        if filtered:
            labels, values, colors = zip(*filtered)

        fig = go.Figure(data=[go.Pie(
            labels=labels,
            values=values,
            hole=0.4,
            marker_colors=colors,
            textinfo='label+percent+value',
            texttemplate='%{label}<br>$%{value:,.0f}<br>(%{percent})',
        )])

        fig.update_layout(
            title=f"Monthly Value Breakdown - {self.results.project_name}",
            showlegend=True,
            annotations=[dict(
                text=f'Total<br>${breakdown.total:,.0f}',
                x=0.5, y=0.5, font_size=16, showarrow=False
            )]
        )

        return fig

    def monthly_projection_chart(self, backend: str = "matplotlib") -> Any:
        """
        Create a monthly projection line chart.

        Args:
            backend: 'matplotlib' or 'plotly'

        Returns:
            Figure object
        """
        if backend == "plotly" and _check_plotly():
            return self._monthly_projection_plotly()
        elif _check_matplotlib():
            return self._monthly_projection_matplotlib()
        else:
            raise ImportError("Neither matplotlib nor plotly is available")

    def _monthly_projection_matplotlib(self):
        """Create monthly projection chart with matplotlib."""
        import matplotlib.pyplot as plt
        import numpy as np

        projections = self.results.monthly_projections
        months = [p.month for p in projections]
        gross_values = [p.gross_value for p in projections]
        risk_adjusted = [p.risk_adjusted_value for p in projections]
        costs = [p.cost for p in projections]
        cumulative = [p.cumulative_net_value for p in projections]

        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))

        # Top chart: Monthly values
        ax1.fill_between(months, gross_values, alpha=0.3, color=self.COLORS["positive"])
        ax1.plot(months, gross_values, label='Gross Value', color=self.COLORS["positive"], linewidth=2)
        ax1.plot(months, risk_adjusted, label='Risk-Adjusted Value',
                color=self.COLORS["neutral"], linewidth=2, linestyle='--')
        ax1.plot(months, costs, label='Monthly Cost', color=self.COLORS["negative"], linewidth=2)

        ax1.set_xlabel('Month')
        ax1.set_ylabel('Value ($)')
        ax1.set_title('Monthly Value and Cost Projection')
        ax1.legend(loc='upper left')
        ax1.grid(True, alpha=0.3)

        # Add maturity stage annotations
        self._add_stage_annotations(ax1, projections)

        # Bottom chart: Cumulative net value
        positive_mask = np.array(cumulative) >= 0
        negative_mask = np.array(cumulative) < 0

        ax2.fill_between(months, cumulative, where=positive_mask,
                        alpha=0.3, color=self.COLORS["positive"])
        ax2.fill_between(months, cumulative, where=negative_mask,
                        alpha=0.3, color=self.COLORS["negative"])
        ax2.plot(months, cumulative, color=self.COLORS["neutral"], linewidth=2)
        ax2.axhline(y=0, color='black', linestyle='-', linewidth=0.5)

        # Mark payback point
        if self.results.payback_months:
            ax2.axvline(x=self.results.payback_months, color='green',
                       linestyle='--', linewidth=2, label=f'Payback: {self.results.payback_months:.1f} months')
            ax2.legend()

        ax2.set_xlabel('Month')
        ax2.set_ylabel('Cumulative Net Value ($)')
        ax2.set_title('Cumulative Net Value Over Time')
        ax2.grid(True, alpha=0.3)

        plt.tight_layout()
        return fig

    def _add_stage_annotations(self, ax, projections: List[MonthlyProjection]):
        """Add maturity stage background colors to chart."""
        from .models import MaturityStage

        stage_colors = {
            MaturityStage.PILOT: '#fef3c7',      # Yellow
            MaturityStage.PROVEN: '#dcfce7',     # Green
            MaturityStage.SCALED: '#dbeafe',     # Blue
            MaturityStage.OPTIMIZED: '#ede9fe',  # Purple
        }

        current_stage = None
        start_month = 1

        for p in projections:
            if p.stage != current_stage:
                if current_stage is not None:
                    ax.axvspan(start_month, p.month, alpha=0.2,
                              color=stage_colors.get(current_stage, 'gray'))
                current_stage = p.stage
                start_month = p.month

        # Fill last stage
        if current_stage:
            ax.axvspan(start_month, projections[-1].month + 1, alpha=0.2,
                      color=stage_colors.get(current_stage, 'gray'))

    def _monthly_projection_plotly(self):
        """Create monthly projection chart with plotly."""
        import plotly.graph_objects as go
        from plotly.subplots import make_subplots

        projections = self.results.monthly_projections
        months = [p.month for p in projections]
        gross_values = [p.gross_value for p in projections]
        risk_adjusted = [p.risk_adjusted_value for p in projections]
        costs = [p.cost for p in projections]
        cumulative = [p.cumulative_net_value for p in projections]

        fig = make_subplots(rows=2, cols=1,
                           subplot_titles=('Monthly Value and Cost', 'Cumulative Net Value'))

        # Top chart
        fig.add_trace(
            go.Scatter(x=months, y=gross_values, name='Gross Value',
                      fill='tozeroy', line=dict(color=self.COLORS["positive"])),
            row=1, col=1
        )
        fig.add_trace(
            go.Scatter(x=months, y=risk_adjusted, name='Risk-Adjusted',
                      line=dict(color=self.COLORS["neutral"], dash='dash')),
            row=1, col=1
        )
        fig.add_trace(
            go.Scatter(x=months, y=costs, name='Monthly Cost',
                      line=dict(color=self.COLORS["negative"])),
            row=1, col=1
        )

        # Bottom chart
        fig.add_trace(
            go.Scatter(x=months, y=cumulative, name='Cumulative Net Value',
                      fill='tozeroy', line=dict(color=self.COLORS["neutral"])),
            row=2, col=1
        )

        # Add payback line
        if self.results.payback_months:
            fig.add_vline(x=self.results.payback_months, line_dash="dash",
                         line_color="green", row=2, col=1,
                         annotation_text=f"Payback: {self.results.payback_months:.1f}mo")

        fig.update_layout(
            height=800,
            title_text=f"Monthly Projections - {self.results.project_name}",
            showlegend=True
        )

        return fig

    def waterfall_chart(self, backend: str = "matplotlib") -> Any:
        """
        Create a waterfall chart showing value build-up.

        Args:
            backend: 'matplotlib' or 'plotly'

        Returns:
            Figure object
        """
        if backend == "plotly" and _check_plotly():
            return self._waterfall_plotly()
        elif _check_matplotlib():
            return self._waterfall_matplotlib()
        else:
            raise ImportError("Neither matplotlib nor plotly is available")

    def _waterfall_matplotlib(self):
        """Create waterfall chart with matplotlib."""
        import matplotlib.pyplot as plt
        import numpy as np

        breakdown = self.results.value_breakdown
        months = self.results.duration_months

        # Categories and values
        categories = ['DLA', 'TA', 'DQP', 'LV', 'OLV', 'Gross Total',
                     'Risk Adj.', 'Total Cost', 'Net Value']

        # Monthly values annualized
        dla_total = breakdown.dla * months
        ta_total = breakdown.ta * months
        dqp_total = breakdown.dqp * months
        lv_total = breakdown.lv * months
        olv_total = breakdown.olv * months
        gross_total = self.results.total_gross_value
        risk_adj = self.results.total_risk_adjusted_value - gross_total
        total_cost = -self.results.total_cost
        net_value = self.results.total_risk_adjusted_value - self.results.total_cost

        values = [dla_total, ta_total, dqp_total, lv_total, olv_total,
                 0, risk_adj, total_cost, 0]

        # Calculate cumulative for positioning
        cumulative = np.zeros(len(values))
        for i, v in enumerate(values):
            if i == 0:
                cumulative[i] = v
            elif categories[i] in ['Gross Total', 'Net Value']:
                cumulative[i] = cumulative[i-1]
            else:
                cumulative[i] = cumulative[i-1] + v

        # Create figure
        fig, ax = plt.subplots(figsize=(12, 8))

        # Color mapping
        colors = []
        for i, (cat, val) in enumerate(zip(categories, values)):
            if cat in ['Gross Total', 'Net Value']:
                colors.append(self.COLORS["neutral"])
            elif val >= 0:
                colors.append(self.COLORS["positive"])
            else:
                colors.append(self.COLORS["negative"])

        # Create bars
        x = np.arange(len(categories))
        bottoms = []
        heights = []

        for i, (cat, val) in enumerate(zip(categories, values)):
            if cat == 'Gross Total':
                bottoms.append(0)
                heights.append(gross_total)
            elif cat == 'Net Value':
                bottoms.append(0)
                heights.append(net_value)
            elif val >= 0:
                if i == 0:
                    bottoms.append(0)
                else:
                    bottoms.append(cumulative[i] - val)
                heights.append(val)
            else:
                bottoms.append(cumulative[i])
                heights.append(-val)

        bars = ax.bar(x, heights, bottom=bottoms, color=colors, edgecolor='white')

        # Add value labels
        for i, (bar, val) in enumerate(zip(bars, values)):
            if categories[i] == 'Gross Total':
                display_val = gross_total
            elif categories[i] == 'Net Value':
                display_val = net_value
            else:
                display_val = val

            height = bar.get_height()
            y_pos = bar.get_y() + height / 2

            ax.text(bar.get_x() + bar.get_width() / 2, y_pos,
                   f'${display_val:,.0f}', ha='center', va='center',
                   fontsize=9, fontweight='bold', color='white')

        ax.set_xticks(x)
        ax.set_xticklabels(categories, rotation=45, ha='right')
        ax.set_ylabel('Value ($)')
        ax.set_title(f'Value Waterfall - {self.results.project_name} ({months} months)')
        ax.axhline(y=0, color='black', linewidth=0.5)
        ax.grid(True, alpha=0.3, axis='y')

        plt.tight_layout()
        return fig

    def _waterfall_plotly(self):
        """Create waterfall chart with plotly."""
        import plotly.graph_objects as go

        breakdown = self.results.value_breakdown
        months = self.results.duration_months

        categories = ['DLA', 'TA', 'DQP', 'LV', 'OLV', 'Gross Total',
                     'Risk Adjustment', 'Total Cost', 'Net Value']

        dla_total = breakdown.dla * months
        ta_total = breakdown.ta * months
        dqp_total = breakdown.dqp * months
        lv_total = breakdown.lv * months
        olv_total = breakdown.olv * months
        risk_adj = self.results.total_risk_adjusted_value - self.results.total_gross_value
        total_cost = -self.results.total_cost
        net_value = self.results.total_risk_adjusted_value - self.results.total_cost

        measures = ['relative', 'relative', 'relative', 'relative', 'relative',
                   'total', 'relative', 'relative', 'total']
        values = [dla_total, ta_total, dqp_total, lv_total, olv_total,
                 0, risk_adj, total_cost, net_value]

        fig = go.Figure(go.Waterfall(
            name="Value Build-up",
            orientation="v",
            measure=measures,
            x=categories,
            textposition="inside",
            text=[f"${v:,.0f}" for v in values],
            y=values,
            connector={"line": {"color": "rgb(63, 63, 63)"}},
            increasing={"marker": {"color": self.COLORS["positive"]}},
            decreasing={"marker": {"color": self.COLORS["negative"]}},
            totals={"marker": {"color": self.COLORS["neutral"]}},
        ))

        fig.update_layout(
            title=f"Value Waterfall - {self.results.project_name} ({months} months)",
            showlegend=False,
        )

        return fig

    def sensitivity_chart(
        self,
        sensitivity_results: List[Tuple[float, AURAResults]],
        parameter_name: str,
        backend: str = "matplotlib"
    ) -> Any:
        """
        Create a tornado/sensitivity chart.

        Args:
            sensitivity_results: Results from sensitivity analysis
            parameter_name: Name of varied parameter
            backend: 'matplotlib' or 'plotly'

        Returns:
            Figure object
        """
        if backend == "plotly" and _check_plotly():
            return self._sensitivity_plotly(sensitivity_results, parameter_name)
        elif _check_matplotlib():
            return self._sensitivity_matplotlib(sensitivity_results, parameter_name)
        else:
            raise ImportError("Neither matplotlib nor plotly is available")

    def _sensitivity_matplotlib(
        self,
        sensitivity_results: List[Tuple[float, AURAResults]],
        parameter_name: str
    ):
        """Create sensitivity chart with matplotlib."""
        import matplotlib.pyplot as plt

        multipliers = [r[0] for r in sensitivity_results]
        npvs = [r[1].net_present_value for r in sensitivity_results]
        rois = [r[1].roi_percentage for r in sensitivity_results]

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

        # NPV sensitivity
        ax1.plot(multipliers, npvs, 'b-o', linewidth=2, markersize=8)
        ax1.axhline(y=0, color='red', linestyle='--', alpha=0.5)
        ax1.axvline(x=1.0, color='gray', linestyle='--', alpha=0.5)
        ax1.set_xlabel(f'{parameter_name} Multiplier')
        ax1.set_ylabel('NPV ($)')
        ax1.set_title('NPV Sensitivity')
        ax1.grid(True, alpha=0.3)

        # ROI sensitivity
        ax2.plot(multipliers, rois, 'g-o', linewidth=2, markersize=8)
        ax2.axhline(y=0, color='red', linestyle='--', alpha=0.5)
        ax2.axvline(x=1.0, color='gray', linestyle='--', alpha=0.5)
        ax2.set_xlabel(f'{parameter_name} Multiplier')
        ax2.set_ylabel('ROI (%)')
        ax2.set_title('ROI Sensitivity')
        ax2.grid(True, alpha=0.3)

        plt.suptitle(f'Sensitivity Analysis: {parameter_name}', fontsize=14, fontweight='bold')
        plt.tight_layout()
        return fig

    def _sensitivity_plotly(
        self,
        sensitivity_results: List[Tuple[float, AURAResults]],
        parameter_name: str
    ):
        """Create sensitivity chart with plotly."""
        import plotly.graph_objects as go
        from plotly.subplots import make_subplots

        multipliers = [r[0] for r in sensitivity_results]
        npvs = [r[1].net_present_value for r in sensitivity_results]
        rois = [r[1].roi_percentage for r in sensitivity_results]

        fig = make_subplots(rows=1, cols=2,
                           subplot_titles=('NPV Sensitivity', 'ROI Sensitivity'))

        fig.add_trace(
            go.Scatter(x=multipliers, y=npvs, mode='lines+markers',
                      name='NPV', line=dict(color='blue', width=2)),
            row=1, col=1
        )

        fig.add_trace(
            go.Scatter(x=multipliers, y=rois, mode='lines+markers',
                      name='ROI', line=dict(color='green', width=2)),
            row=1, col=2
        )

        fig.update_layout(
            title=f'Sensitivity Analysis: {parameter_name}',
            showlegend=True,
            height=500,
        )

        return fig

    def maturity_curve_chart(self, backend: str = "matplotlib") -> Any:
        """
        Create a maturity curve visualization.

        Args:
            backend: 'matplotlib' or 'plotly'

        Returns:
            Figure object
        """
        if backend == "plotly" and _check_plotly():
            return self._maturity_curve_plotly()
        elif _check_matplotlib():
            return self._maturity_curve_matplotlib()
        else:
            raise ImportError("Neither matplotlib nor plotly is available")

    def _maturity_curve_matplotlib(self):
        """Create maturity curve with matplotlib."""
        import matplotlib.pyplot as plt
        import numpy as np

        config = self.results.maturity_config
        months = list(range(1, self.results.duration_months + 1))
        multipliers = [config.get_multiplier_at_month(m) for m in months]

        fig, ax = plt.subplots(figsize=(12, 6))

        # Plot maturity curve
        ax.plot(months, multipliers, 'b-', linewidth=2)
        ax.fill_between(months, multipliers, alpha=0.3)

        # Add stage boundaries
        stage_boundaries = [
            config.pilot_duration_months,
            config.pilot_duration_months + config.proven_duration_months,
            (config.pilot_duration_months + config.proven_duration_months +
             config.scaled_duration_months),
        ]

        stage_labels = ['Pilot', 'Proven', 'Scaled', 'Optimized']
        colors = ['#fef3c7', '#dcfce7', '#dbeafe', '#ede9fe']

        prev = 0
        for i, boundary in enumerate(stage_boundaries + [months[-1]]):
            ax.axvspan(prev, boundary, alpha=0.3, color=colors[i])
            mid = (prev + boundary) / 2
            ax.text(mid, max(multipliers) * 1.05, stage_labels[i],
                   ha='center', fontsize=10, fontweight='bold')
            prev = boundary

        ax.set_xlabel('Month')
        ax.set_ylabel('Maturity Multiplier')
        ax.set_title('AI Agent Maturity Curve')
        ax.grid(True, alpha=0.3)
        ax.set_ylim(0, max(multipliers) * 1.2)

        plt.tight_layout()
        return fig

    def _maturity_curve_plotly(self):
        """Create maturity curve with plotly."""
        import plotly.graph_objects as go

        config = self.results.maturity_config
        months = list(range(1, self.results.duration_months + 1))
        multipliers = [config.get_multiplier_at_month(m) for m in months]

        fig = go.Figure()

        fig.add_trace(go.Scatter(
            x=months,
            y=multipliers,
            mode='lines',
            fill='tozeroy',
            name='Maturity Multiplier',
            line=dict(color='blue', width=2),
        ))

        fig.update_layout(
            title='AI Agent Maturity Curve',
            xaxis_title='Month',
            yaxis_title='Maturity Multiplier',
            showlegend=True,
        )

        return fig

    def export_to_base64(self, fig: Any, format: str = "png") -> str:
        """
        Export a matplotlib figure to base64.

        Args:
            fig: Matplotlib figure
            format: Image format ('png', 'jpg', 'svg')

        Returns:
            Base64 encoded string
        """
        buffer = io.BytesIO()
        fig.savefig(buffer, format=format, bbox_inches='tight', dpi=150)
        buffer.seek(0)
        return base64.b64encode(buffer.getvalue()).decode()
