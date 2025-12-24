"""
Setup configuration for AURA Framework Python package.
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read the README
readme_path = Path(__file__).parent.parent.parent / "README.md"
if readme_path.exists():
    long_description = readme_path.read_text(encoding="utf-8")
else:
    long_description = "AURA Framework - AI Utility & Return Assessment"

setup(
    name="aura-roi",
    version="1.0.0",
    author="Karthik Sukumar",
    author_email="karthik.sukumar@oracle.com",
    description="AURA Framework - AI Utility & Return Assessment for calculating ROI on AI Agent projects",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/your-username/ai-agent-roi-framework",
    project_urls={
        "Bug Tracker": "https://github.com/your-username/ai-agent-roi-framework/issues",
        "Documentation": "https://github.com/your-username/ai-agent-roi-framework/docs",
    },
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: Financial and Insurance Industry",
        "Intended Audience :: Information Technology",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Office/Business :: Financial",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    python_requires=">=3.9",
    install_requires=[
        # Core dependencies (none required for basic functionality)
    ],
    extras_require={
        "visualization": [
            "matplotlib>=3.5.0",
            "plotly>=5.0.0",
        ],
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "black>=23.0.0",
            "mypy>=1.0.0",
            "isort>=5.0.0",
        ],
        "all": [
            "matplotlib>=3.5.0",
            "plotly>=5.0.0",
            "pandas>=1.5.0",
            "numpy>=1.21.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "aura=aura_roi.cli:main",
        ],
    },
    include_package_data=True,
    zip_safe=False,
)
