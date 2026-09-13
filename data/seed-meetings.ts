// Fathom Seed Meetings Dataset
// Contains 4 comprehensive production-grade meeting records:
// 1. Benchmark 8-Person Call (42m 15s) with 85+ diarized segments, complete 4-template summaries, 7 action items, 5 highlights.
// 2. Enterprise B2B Sales Discovery: Acme Corp <> Fathom (28m 40s).
// 3. Product & Design Critique: Fathom 2.0 Video Scrubber & Navigation (18m 20s).
// 4. Bi-Weekly 1-on-1 Mentorship: Engineering Career Growth & Feedback (15m 00s).

import { Meeting } from "@/types/meeting";

export const SEED_MEETINGS: Meeting[] = [
  {
    "id": "meeting-1",
    "title": "Q3 Platform Architecture & Scalability Sync",
    "date": "2026-09-12T14:00:00.000Z",
    "duration": 2535,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "participants": [
      {
        "id": "spk-1",
        "name": "Sarah Chen",
        "role": "Staff Backend Engineer",
        "company": "Fathom Engineering",
        "color": "#3B82F6",
        "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-2",
        "name": "Alex Rivera",
        "role": "Principal Infrastructure Architect",
        "company": "Fathom Engineering",
        "color": "#10B981",
        "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-3",
        "name": "Priya Patel",
        "role": "VP of Product",
        "company": "Fathom Product",
        "color": "#8B5CF6",
        "avatarUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-4",
        "name": "Marcus Brody",
        "role": "DevOps & SRE Lead",
        "company": "Fathom Infrastructure",
        "color": "#F59E0B",
        "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-5",
        "name": "Elena Rostova",
        "role": "QA & Reliability Lead",
        "company": "Fathom Engineering",
        "color": "#EC4899",
        "avatarUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-6",
        "name": "David Kim",
        "role": "Data Platform Engineer",
        "company": "Fathom Data Platform",
        "color": "#06B6D4",
        "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-7",
        "name": "Maya Lin",
        "role": "Staff Frontend Engineer",
        "company": "Fathom Frontend",
        "color": "#F97316",
        "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-8",
        "name": "James Wilson",
        "role": "Head of Information Security",
        "company": "Fathom Security",
        "color": "#64748B",
        "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      }
    ],
    "transcript": [
      {
        "id": "seg-1-001",
        "speakerId": "spk-3",
        "start": 0,
        "end": 20,
        "text": "Good morning everyone, and welcome to our Q3 Platform Architecture and Scalability Sync. We have the full technical leadership team assembled here today.",
        "words": [
          {
            "text": "Good",
            "start": 0,
            "end": 0.83
          },
          {
            "text": "morning",
            "start": 0.87,
            "end": 1.7
          },
          {
            "text": "everyone,",
            "start": 1.74,
            "end": 2.57
          },
          {
            "text": "and",
            "start": 2.61,
            "end": 3.43
          },
          {
            "text": "welcome",
            "start": 3.48,
            "end": 4.3
          },
          {
            "text": "to",
            "start": 4.35,
            "end": 5.17
          },
          {
            "text": "our",
            "start": 5.22,
            "end": 6.04
          },
          {
            "text": "Q3",
            "start": 6.09,
            "end": 6.91
          },
          {
            "text": "Platform",
            "start": 6.96,
            "end": 7.78
          },
          {
            "text": "Architecture",
            "start": 7.83,
            "end": 8.65
          },
          {
            "text": "and",
            "start": 8.7,
            "end": 9.52
          },
          {
            "text": "Scalability",
            "start": 9.57,
            "end": 10.39
          },
          {
            "text": "Sync.",
            "start": 10.43,
            "end": 11.26
          },
          {
            "text": "We",
            "start": 11.3,
            "end": 12.13
          },
          {
            "text": "have",
            "start": 12.17,
            "end": 13
          },
          {
            "text": "the",
            "start": 13.04,
            "end": 13.87
          },
          {
            "text": "full",
            "start": 13.91,
            "end": 14.74
          },
          {
            "text": "technical",
            "start": 14.78,
            "end": 15.61
          },
          {
            "text": "leadership",
            "start": 15.65,
            "end": 16.48
          },
          {
            "text": "team",
            "start": 16.52,
            "end": 17.35
          },
          {
            "text": "assembled",
            "start": 17.39,
            "end": 18.22
          },
          {
            "text": "here",
            "start": 18.26,
            "end": 19.09
          },
          {
            "text": "today.",
            "start": 19.13,
            "end": 19.96
          }
        ]
      },
      {
        "id": "seg-1-002",
        "speakerId": "spk-3",
        "start": 22,
        "end": 44,
        "text": "Our primary objective today is establishing concrete architectural paths to take our platform availability from ninety-nine point nine percent to four nines, ninety-nine point nine nine percent.",
        "words": [
          {
            "text": "Our",
            "start": 22,
            "end": 22.77
          },
          {
            "text": "primary",
            "start": 22.81,
            "end": 23.59
          },
          {
            "text": "objective",
            "start": 23.63,
            "end": 24.4
          },
          {
            "text": "today",
            "start": 24.44,
            "end": 25.22
          },
          {
            "text": "is",
            "start": 25.26,
            "end": 26.03
          },
          {
            "text": "establishing",
            "start": 26.07,
            "end": 26.85
          },
          {
            "text": "concrete",
            "start": 26.89,
            "end": 27.66
          },
          {
            "text": "architectural",
            "start": 27.7,
            "end": 28.48
          },
          {
            "text": "paths",
            "start": 28.52,
            "end": 29.29
          },
          {
            "text": "to",
            "start": 29.33,
            "end": 30.11
          },
          {
            "text": "take",
            "start": 30.15,
            "end": 30.92
          },
          {
            "text": "our",
            "start": 30.96,
            "end": 31.74
          },
          {
            "text": "platform",
            "start": 31.78,
            "end": 32.55
          },
          {
            "text": "availability",
            "start": 32.59,
            "end": 33.37
          },
          {
            "text": "from",
            "start": 33.41,
            "end": 34.18
          },
          {
            "text": "ninety-nine",
            "start": 34.22,
            "end": 35
          },
          {
            "text": "point",
            "start": 35.04,
            "end": 35.81
          },
          {
            "text": "nine",
            "start": 35.85,
            "end": 36.63
          },
          {
            "text": "percent",
            "start": 36.67,
            "end": 37.44
          },
          {
            "text": "to",
            "start": 37.48,
            "end": 38.26
          },
          {
            "text": "four",
            "start": 38.3,
            "end": 39.07
          },
          {
            "text": "nines,",
            "start": 39.11,
            "end": 39.89
          },
          {
            "text": "ninety-nine",
            "start": 39.93,
            "end": 40.7
          },
          {
            "text": "point",
            "start": 40.74,
            "end": 41.51
          },
          {
            "text": "nine",
            "start": 41.56,
            "end": 42.33
          },
          {
            "text": "nine",
            "start": 42.37,
            "end": 43.14
          },
          {
            "text": "percent.",
            "start": 43.19,
            "end": 43.96
          }
        ]
      },
      {
        "id": "seg-1-003",
        "speakerId": "spk-2",
        "start": 46,
        "end": 69,
        "text": "Thanks Priya. Looking at the telemetry from last quarter's peak usage during the enterprise rollout, our core API tier held up well, but we observed severe tail latency degradation during burst traffic.",
        "words": [
          {
            "text": "Thanks",
            "start": 46,
            "end": 46.68
          },
          {
            "text": "Priya.",
            "start": 46.72,
            "end": 47.4
          },
          {
            "text": "Looking",
            "start": 47.44,
            "end": 48.12
          },
          {
            "text": "at",
            "start": 48.16,
            "end": 48.84
          },
          {
            "text": "the",
            "start": 48.88,
            "end": 49.56
          },
          {
            "text": "telemetry",
            "start": 49.59,
            "end": 50.28
          },
          {
            "text": "from",
            "start": 50.31,
            "end": 51
          },
          {
            "text": "last",
            "start": 51.03,
            "end": 51.71
          },
          {
            "text": "quarter's",
            "start": 51.75,
            "end": 52.43
          },
          {
            "text": "peak",
            "start": 52.47,
            "end": 53.15
          },
          {
            "text": "usage",
            "start": 53.19,
            "end": 53.87
          },
          {
            "text": "during",
            "start": 53.91,
            "end": 54.59
          },
          {
            "text": "the",
            "start": 54.63,
            "end": 55.31
          },
          {
            "text": "enterprise",
            "start": 55.34,
            "end": 56.03
          },
          {
            "text": "rollout,",
            "start": 56.06,
            "end": 56.75
          },
          {
            "text": "our",
            "start": 56.78,
            "end": 57.46
          },
          {
            "text": "core",
            "start": 57.5,
            "end": 58.18
          },
          {
            "text": "API",
            "start": 58.22,
            "end": 58.9
          },
          {
            "text": "tier",
            "start": 58.94,
            "end": 59.62
          },
          {
            "text": "held",
            "start": 59.66,
            "end": 60.34
          },
          {
            "text": "up",
            "start": 60.38,
            "end": 61.06
          },
          {
            "text": "well,",
            "start": 61.09,
            "end": 61.78
          },
          {
            "text": "but",
            "start": 61.81,
            "end": 62.5
          },
          {
            "text": "we",
            "start": 62.53,
            "end": 63.21
          },
          {
            "text": "observed",
            "start": 63.25,
            "end": 63.93
          },
          {
            "text": "severe",
            "start": 63.97,
            "end": 64.65
          },
          {
            "text": "tail",
            "start": 64.69,
            "end": 65.37
          },
          {
            "text": "latency",
            "start": 65.41,
            "end": 66.09
          },
          {
            "text": "degradation",
            "start": 66.13,
            "end": 66.81
          },
          {
            "text": "during",
            "start": 66.84,
            "end": 67.53
          },
          {
            "text": "burst",
            "start": 67.56,
            "end": 68.25
          },
          {
            "text": "traffic.",
            "start": 68.28,
            "end": 68.96
          }
        ]
      },
      {
        "id": "seg-1-004",
        "speakerId": "spk-1",
        "start": 71,
        "end": 94,
        "text": "Specifically, the p99 latency spiked from forty-five milliseconds all the way up to eight hundred and twenty milliseconds whenever concurrent transcription streams crossed twelve thousand active sessions.",
        "words": [
          {
            "text": "Specifically,",
            "start": 71,
            "end": 71.81
          },
          {
            "text": "the",
            "start": 71.85,
            "end": 72.66
          },
          {
            "text": "p99",
            "start": 72.7,
            "end": 73.51
          },
          {
            "text": "latency",
            "start": 73.56,
            "end": 74.36
          },
          {
            "text": "spiked",
            "start": 74.41,
            "end": 75.22
          },
          {
            "text": "from",
            "start": 75.26,
            "end": 76.07
          },
          {
            "text": "forty-five",
            "start": 76.11,
            "end": 76.92
          },
          {
            "text": "milliseconds",
            "start": 76.96,
            "end": 77.77
          },
          {
            "text": "all",
            "start": 77.81,
            "end": 78.62
          },
          {
            "text": "the",
            "start": 78.67,
            "end": 79.48
          },
          {
            "text": "way",
            "start": 79.52,
            "end": 80.33
          },
          {
            "text": "up",
            "start": 80.37,
            "end": 81.18
          },
          {
            "text": "to",
            "start": 81.22,
            "end": 82.03
          },
          {
            "text": "eight",
            "start": 82.07,
            "end": 82.88
          },
          {
            "text": "hundred",
            "start": 82.93,
            "end": 83.74
          },
          {
            "text": "and",
            "start": 83.78,
            "end": 84.59
          },
          {
            "text": "twenty",
            "start": 84.63,
            "end": 85.44
          },
          {
            "text": "milliseconds",
            "start": 85.48,
            "end": 86.29
          },
          {
            "text": "whenever",
            "start": 86.33,
            "end": 87.14
          },
          {
            "text": "concurrent",
            "start": 87.19,
            "end": 87.99
          },
          {
            "text": "transcription",
            "start": 88.04,
            "end": 88.85
          },
          {
            "text": "streams",
            "start": 88.89,
            "end": 89.7
          },
          {
            "text": "crossed",
            "start": 89.74,
            "end": 90.55
          },
          {
            "text": "twelve",
            "start": 90.59,
            "end": 91.4
          },
          {
            "text": "thousand",
            "start": 91.44,
            "end": 92.25
          },
          {
            "text": "active",
            "start": 92.3,
            "end": 93.11
          },
          {
            "text": "sessions.",
            "start": 93.15,
            "end": 93.96
          }
        ]
      },
      {
        "id": "seg-1-005",
        "speakerId": "spk-4",
        "start": 97,
        "end": 120,
        "text": "From an infrastructure standpoint, Marcus here. The Kubernetes cluster autoscaler reacted according to rules, but provisioning new node pools in us-east took an average of three point five minutes.",
        "words": [
          {
            "text": "From",
            "start": 97,
            "end": 97.75
          },
          {
            "text": "an",
            "start": 97.79,
            "end": 98.55
          },
          {
            "text": "infrastructure",
            "start": 98.59,
            "end": 99.34
          },
          {
            "text": "standpoint,",
            "start": 99.38,
            "end": 100.13
          },
          {
            "text": "Marcus",
            "start": 100.17,
            "end": 100.93
          },
          {
            "text": "here.",
            "start": 100.97,
            "end": 101.72
          },
          {
            "text": "The",
            "start": 101.76,
            "end": 102.51
          },
          {
            "text": "Kubernetes",
            "start": 102.55,
            "end": 103.31
          },
          {
            "text": "cluster",
            "start": 103.34,
            "end": 104.1
          },
          {
            "text": "autoscaler",
            "start": 104.14,
            "end": 104.89
          },
          {
            "text": "reacted",
            "start": 104.93,
            "end": 105.68
          },
          {
            "text": "according",
            "start": 105.72,
            "end": 106.48
          },
          {
            "text": "to",
            "start": 106.52,
            "end": 107.27
          },
          {
            "text": "rules,",
            "start": 107.31,
            "end": 108.06
          },
          {
            "text": "but",
            "start": 108.1,
            "end": 108.86
          },
          {
            "text": "provisioning",
            "start": 108.9,
            "end": 109.65
          },
          {
            "text": "new",
            "start": 109.69,
            "end": 110.44
          },
          {
            "text": "node",
            "start": 110.48,
            "end": 111.24
          },
          {
            "text": "pools",
            "start": 111.28,
            "end": 112.03
          },
          {
            "text": "in",
            "start": 112.07,
            "end": 112.82
          },
          {
            "text": "us-east",
            "start": 112.86,
            "end": 113.62
          },
          {
            "text": "took",
            "start": 113.66,
            "end": 114.41
          },
          {
            "text": "an",
            "start": 114.45,
            "end": 115.2
          },
          {
            "text": "average",
            "start": 115.24,
            "end": 115.99
          },
          {
            "text": "of",
            "start": 116.03,
            "end": 116.79
          },
          {
            "text": "three",
            "start": 116.83,
            "end": 117.58
          },
          {
            "text": "point",
            "start": 117.62,
            "end": 118.37
          },
          {
            "text": "five",
            "start": 118.41,
            "end": 119.17
          },
          {
            "text": "minutes.",
            "start": 119.21,
            "end": 119.96
          }
        ]
      },
      {
        "id": "seg-1-006",
        "speakerId": "spk-5",
        "start": 122,
        "end": 146,
        "text": "That three-minute lag directly caused the synthetic error budget alerts Elena and the QA team flagged. We had approximately sixty-two dropped websocket connections during the September fourth incident.",
        "words": [
          {
            "text": "That",
            "start": 122,
            "end": 122.81
          },
          {
            "text": "three-minute",
            "start": 122.86,
            "end": 123.67
          },
          {
            "text": "lag",
            "start": 123.71,
            "end": 124.53
          },
          {
            "text": "directly",
            "start": 124.57,
            "end": 125.39
          },
          {
            "text": "caused",
            "start": 125.43,
            "end": 126.24
          },
          {
            "text": "the",
            "start": 126.29,
            "end": 127.1
          },
          {
            "text": "synthetic",
            "start": 127.14,
            "end": 127.96
          },
          {
            "text": "error",
            "start": 128,
            "end": 128.81
          },
          {
            "text": "budget",
            "start": 128.86,
            "end": 129.67
          },
          {
            "text": "alerts",
            "start": 129.71,
            "end": 130.53
          },
          {
            "text": "Elena",
            "start": 130.57,
            "end": 131.39
          },
          {
            "text": "and",
            "start": 131.43,
            "end": 132.24
          },
          {
            "text": "the",
            "start": 132.29,
            "end": 133.1
          },
          {
            "text": "QA",
            "start": 133.14,
            "end": 133.96
          },
          {
            "text": "team",
            "start": 134,
            "end": 134.81
          },
          {
            "text": "flagged.",
            "start": 134.86,
            "end": 135.67
          },
          {
            "text": "We",
            "start": 135.71,
            "end": 136.53
          },
          {
            "text": "had",
            "start": 136.57,
            "end": 137.39
          },
          {
            "text": "approximately",
            "start": 137.43,
            "end": 138.24
          },
          {
            "text": "sixty-two",
            "start": 138.29,
            "end": 139.1
          },
          {
            "text": "dropped",
            "start": 139.14,
            "end": 139.96
          },
          {
            "text": "websocket",
            "start": 140,
            "end": 140.81
          },
          {
            "text": "connections",
            "start": 140.86,
            "end": 141.67
          },
          {
            "text": "during",
            "start": 141.71,
            "end": 142.53
          },
          {
            "text": "the",
            "start": 142.57,
            "end": 143.39
          },
          {
            "text": "September",
            "start": 143.43,
            "end": 144.24
          },
          {
            "text": "fourth",
            "start": 144.29,
            "end": 145.1
          },
          {
            "text": "incident.",
            "start": 145.14,
            "end": 145.96
          }
        ]
      },
      {
        "id": "seg-1-007",
        "speakerId": "spk-6",
        "start": 148,
        "end": 171,
        "text": "And on the data platform side, Kafka broker partitions were undergoing rebalancing right when the node autoscaling kicked in, which compounded the consumer lag.",
        "words": [
          {
            "text": "And",
            "start": 148,
            "end": 148.91
          },
          {
            "text": "on",
            "start": 148.96,
            "end": 149.87
          },
          {
            "text": "the",
            "start": 149.92,
            "end": 150.83
          },
          {
            "text": "data",
            "start": 150.88,
            "end": 151.79
          },
          {
            "text": "platform",
            "start": 151.83,
            "end": 152.74
          },
          {
            "text": "side,",
            "start": 152.79,
            "end": 153.7
          },
          {
            "text": "Kafka",
            "start": 153.75,
            "end": 154.66
          },
          {
            "text": "broker",
            "start": 154.71,
            "end": 155.62
          },
          {
            "text": "partitions",
            "start": 155.67,
            "end": 156.58
          },
          {
            "text": "were",
            "start": 156.63,
            "end": 157.54
          },
          {
            "text": "undergoing",
            "start": 157.58,
            "end": 158.49
          },
          {
            "text": "rebalancing",
            "start": 158.54,
            "end": 159.45
          },
          {
            "text": "right",
            "start": 159.5,
            "end": 160.41
          },
          {
            "text": "when",
            "start": 160.46,
            "end": 161.37
          },
          {
            "text": "the",
            "start": 161.42,
            "end": 162.33
          },
          {
            "text": "node",
            "start": 162.38,
            "end": 163.29
          },
          {
            "text": "autoscaling",
            "start": 163.33,
            "end": 164.24
          },
          {
            "text": "kicked",
            "start": 164.29,
            "end": 165.2
          },
          {
            "text": "in,",
            "start": 165.25,
            "end": 166.16
          },
          {
            "text": "which",
            "start": 166.21,
            "end": 167.12
          },
          {
            "text": "compounded",
            "start": 167.17,
            "end": 168.08
          },
          {
            "text": "the",
            "start": 168.13,
            "end": 169.04
          },
          {
            "text": "consumer",
            "start": 169.08,
            "end": 169.99
          },
          {
            "text": "lag.",
            "start": 170.04,
            "end": 170.95
          }
        ]
      },
      {
        "id": "seg-1-008",
        "speakerId": "spk-7",
        "start": 174,
        "end": 198,
        "text": "On the client side, users were seeing the video scrubber desynchronize from the transcript display because websocket reconnects were dropping pending delta frames.",
        "words": [
          {
            "text": "On",
            "start": 174,
            "end": 174.99
          },
          {
            "text": "the",
            "start": 175.04,
            "end": 176.03
          },
          {
            "text": "client",
            "start": 176.09,
            "end": 177.08
          },
          {
            "text": "side,",
            "start": 177.13,
            "end": 178.12
          },
          {
            "text": "users",
            "start": 178.17,
            "end": 179.17
          },
          {
            "text": "were",
            "start": 179.22,
            "end": 180.21
          },
          {
            "text": "seeing",
            "start": 180.26,
            "end": 181.25
          },
          {
            "text": "the",
            "start": 181.3,
            "end": 182.3
          },
          {
            "text": "video",
            "start": 182.35,
            "end": 183.34
          },
          {
            "text": "scrubber",
            "start": 183.39,
            "end": 184.38
          },
          {
            "text": "desynchronize",
            "start": 184.43,
            "end": 185.43
          },
          {
            "text": "from",
            "start": 185.48,
            "end": 186.47
          },
          {
            "text": "the",
            "start": 186.52,
            "end": 187.51
          },
          {
            "text": "transcript",
            "start": 187.57,
            "end": 188.56
          },
          {
            "text": "display",
            "start": 188.61,
            "end": 189.6
          },
          {
            "text": "because",
            "start": 189.65,
            "end": 190.64
          },
          {
            "text": "websocket",
            "start": 190.7,
            "end": 191.69
          },
          {
            "text": "reconnects",
            "start": 191.74,
            "end": 192.73
          },
          {
            "text": "were",
            "start": 192.78,
            "end": 193.77
          },
          {
            "text": "dropping",
            "start": 193.83,
            "end": 194.82
          },
          {
            "text": "pending",
            "start": 194.87,
            "end": 195.86
          },
          {
            "text": "delta",
            "start": 195.91,
            "end": 196.9
          },
          {
            "text": "frames.",
            "start": 196.96,
            "end": 197.95
          }
        ]
      },
      {
        "id": "seg-1-009",
        "speakerId": "spk-8",
        "start": 200,
        "end": 226,
        "text": "James here from InfoSec. Keep in mind that as we expand into multi-region redundancy, every cross-region egress channel must remain encrypted with zero-trust mTLS proxies under our SOC2 Type II requirements.",
        "words": [
          {
            "text": "James",
            "start": 200,
            "end": 200.8
          },
          {
            "text": "here",
            "start": 200.84,
            "end": 201.64
          },
          {
            "text": "from",
            "start": 201.68,
            "end": 202.47
          },
          {
            "text": "InfoSec.",
            "start": 202.52,
            "end": 203.31
          },
          {
            "text": "Keep",
            "start": 203.35,
            "end": 204.15
          },
          {
            "text": "in",
            "start": 204.19,
            "end": 204.99
          },
          {
            "text": "mind",
            "start": 205.03,
            "end": 205.83
          },
          {
            "text": "that",
            "start": 205.87,
            "end": 206.67
          },
          {
            "text": "as",
            "start": 206.71,
            "end": 207.51
          },
          {
            "text": "we",
            "start": 207.55,
            "end": 208.35
          },
          {
            "text": "expand",
            "start": 208.39,
            "end": 209.18
          },
          {
            "text": "into",
            "start": 209.23,
            "end": 210.02
          },
          {
            "text": "multi-region",
            "start": 210.06,
            "end": 210.86
          },
          {
            "text": "redundancy,",
            "start": 210.9,
            "end": 211.7
          },
          {
            "text": "every",
            "start": 211.74,
            "end": 212.54
          },
          {
            "text": "cross-region",
            "start": 212.58,
            "end": 213.38
          },
          {
            "text": "egress",
            "start": 213.42,
            "end": 214.22
          },
          {
            "text": "channel",
            "start": 214.26,
            "end": 215.05
          },
          {
            "text": "must",
            "start": 215.1,
            "end": 215.89
          },
          {
            "text": "remain",
            "start": 215.94,
            "end": 216.73
          },
          {
            "text": "encrypted",
            "start": 216.77,
            "end": 217.57
          },
          {
            "text": "with",
            "start": 217.61,
            "end": 218.41
          },
          {
            "text": "zero-trust",
            "start": 218.45,
            "end": 219.25
          },
          {
            "text": "mTLS",
            "start": 219.29,
            "end": 220.09
          },
          {
            "text": "proxies",
            "start": 220.13,
            "end": 220.93
          },
          {
            "text": "under",
            "start": 220.97,
            "end": 221.76
          },
          {
            "text": "our",
            "start": 221.81,
            "end": 222.6
          },
          {
            "text": "SOC2",
            "start": 222.65,
            "end": 223.44
          },
          {
            "text": "Type",
            "start": 223.48,
            "end": 224.28
          },
          {
            "text": "II",
            "start": 224.32,
            "end": 225.12
          },
          {
            "text": "requirements.",
            "start": 225.16,
            "end": 225.96
          }
        ]
      },
      {
        "id": "seg-1-010",
        "speakerId": "spk-2",
        "start": 228,
        "end": 250,
        "text": "Alex here. If we evaluate the overall incident timeline, the cascading failure was triggered by connection exhaustion rather than CPU starvation.",
        "words": [
          {
            "text": "Alex",
            "start": 228,
            "end": 229
          },
          {
            "text": "here.",
            "start": 229.05,
            "end": 230.04
          },
          {
            "text": "If",
            "start": 230.1,
            "end": 231.09
          },
          {
            "text": "we",
            "start": 231.14,
            "end": 232.14
          },
          {
            "text": "evaluate",
            "start": 232.19,
            "end": 233.19
          },
          {
            "text": "the",
            "start": 233.24,
            "end": 234.23
          },
          {
            "text": "overall",
            "start": 234.29,
            "end": 235.28
          },
          {
            "text": "incident",
            "start": 235.33,
            "end": 236.33
          },
          {
            "text": "timeline,",
            "start": 236.38,
            "end": 237.38
          },
          {
            "text": "the",
            "start": 237.43,
            "end": 238.42
          },
          {
            "text": "cascading",
            "start": 238.48,
            "end": 239.47
          },
          {
            "text": "failure",
            "start": 239.52,
            "end": 240.52
          },
          {
            "text": "was",
            "start": 240.57,
            "end": 241.57
          },
          {
            "text": "triggered",
            "start": 241.62,
            "end": 242.61
          },
          {
            "text": "by",
            "start": 242.67,
            "end": 243.66
          },
          {
            "text": "connection",
            "start": 243.71,
            "end": 244.71
          },
          {
            "text": "exhaustion",
            "start": 244.76,
            "end": 245.76
          },
          {
            "text": "rather",
            "start": 245.81,
            "end": 246.8
          },
          {
            "text": "than",
            "start": 246.86,
            "end": 247.85
          },
          {
            "text": "CPU",
            "start": 247.9,
            "end": 248.9
          },
          {
            "text": "starvation.",
            "start": 248.95,
            "end": 249.95
          }
        ]
      },
      {
        "id": "seg-1-011",
        "speakerId": "spk-1",
        "start": 252,
        "end": 273,
        "text": "Exactly Alex. The backend pods were healthy, but they were queuing waiting for database sockets from the shared pool.",
        "words": [
          {
            "text": "Exactly",
            "start": 252,
            "end": 253.05
          },
          {
            "text": "Alex.",
            "start": 253.11,
            "end": 254.16
          },
          {
            "text": "The",
            "start": 254.21,
            "end": 255.26
          },
          {
            "text": "backend",
            "start": 255.32,
            "end": 256.37
          },
          {
            "text": "pods",
            "start": 256.42,
            "end": 257.47
          },
          {
            "text": "were",
            "start": 257.53,
            "end": 258.58
          },
          {
            "text": "healthy,",
            "start": 258.63,
            "end": 259.68
          },
          {
            "text": "but",
            "start": 259.74,
            "end": 260.79
          },
          {
            "text": "they",
            "start": 260.84,
            "end": 261.89
          },
          {
            "text": "were",
            "start": 261.95,
            "end": 263
          },
          {
            "text": "queuing",
            "start": 263.05,
            "end": 264.1
          },
          {
            "text": "waiting",
            "start": 264.16,
            "end": 265.21
          },
          {
            "text": "for",
            "start": 265.26,
            "end": 266.31
          },
          {
            "text": "database",
            "start": 266.37,
            "end": 267.42
          },
          {
            "text": "sockets",
            "start": 267.47,
            "end": 268.52
          },
          {
            "text": "from",
            "start": 268.58,
            "end": 269.63
          },
          {
            "text": "the",
            "start": 269.68,
            "end": 270.73
          },
          {
            "text": "shared",
            "start": 270.79,
            "end": 271.84
          },
          {
            "text": "pool.",
            "start": 271.89,
            "end": 272.94
          }
        ]
      },
      {
        "id": "seg-1-012",
        "speakerId": "spk-3",
        "start": 276,
        "end": 298,
        "text": "Excellent framing. Let's break today's agenda into four core topics: database scaling and caching, service mesh canary rollouts, event streaming resiliency, and frontend edge hydration.",
        "words": [
          {
            "text": "Excellent",
            "start": 276,
            "end": 276.84
          },
          {
            "text": "framing.",
            "start": 276.88,
            "end": 277.72
          },
          {
            "text": "Let's",
            "start": 277.76,
            "end": 278.6
          },
          {
            "text": "break",
            "start": 278.64,
            "end": 279.48
          },
          {
            "text": "today's",
            "start": 279.52,
            "end": 280.36
          },
          {
            "text": "agenda",
            "start": 280.4,
            "end": 281.24
          },
          {
            "text": "into",
            "start": 281.28,
            "end": 282.12
          },
          {
            "text": "four",
            "start": 282.16,
            "end": 283
          },
          {
            "text": "core",
            "start": 283.04,
            "end": 283.88
          },
          {
            "text": "topics:",
            "start": 283.92,
            "end": 284.76
          },
          {
            "text": "database",
            "start": 284.8,
            "end": 285.64
          },
          {
            "text": "scaling",
            "start": 285.68,
            "end": 286.52
          },
          {
            "text": "and",
            "start": 286.56,
            "end": 287.4
          },
          {
            "text": "caching,",
            "start": 287.44,
            "end": 288.28
          },
          {
            "text": "service",
            "start": 288.32,
            "end": 289.16
          },
          {
            "text": "mesh",
            "start": 289.2,
            "end": 290.04
          },
          {
            "text": "canary",
            "start": 290.08,
            "end": 290.92
          },
          {
            "text": "rollouts,",
            "start": 290.96,
            "end": 291.8
          },
          {
            "text": "event",
            "start": 291.84,
            "end": 292.68
          },
          {
            "text": "streaming",
            "start": 292.72,
            "end": 293.56
          },
          {
            "text": "resiliency,",
            "start": 293.6,
            "end": 294.44
          },
          {
            "text": "and",
            "start": 294.48,
            "end": 295.32
          },
          {
            "text": "frontend",
            "start": 295.36,
            "end": 296.2
          },
          {
            "text": "edge",
            "start": 296.24,
            "end": 297.08
          },
          {
            "text": "hydration.",
            "start": 297.12,
            "end": 297.96
          }
        ]
      },
      {
        "id": "seg-1-013",
        "speakerId": "spk-1",
        "start": 301,
        "end": 328,
        "text": "Let's dive right into the database layer. Last month we ran into connection pool exhaustion on our primary Aurora PostgreSQL cluster during the Acme enterprise proof-of-concept.",
        "words": [
          {
            "text": "Let's",
            "start": 301,
            "end": 301.99
          },
          {
            "text": "dive",
            "start": 302.04,
            "end": 303.02
          },
          {
            "text": "right",
            "start": 303.08,
            "end": 304.06
          },
          {
            "text": "into",
            "start": 304.12,
            "end": 305.1
          },
          {
            "text": "the",
            "start": 305.15,
            "end": 306.14
          },
          {
            "text": "database",
            "start": 306.19,
            "end": 307.18
          },
          {
            "text": "layer.",
            "start": 307.23,
            "end": 308.22
          },
          {
            "text": "Last",
            "start": 308.27,
            "end": 309.26
          },
          {
            "text": "month",
            "start": 309.31,
            "end": 310.29
          },
          {
            "text": "we",
            "start": 310.35,
            "end": 311.33
          },
          {
            "text": "ran",
            "start": 311.38,
            "end": 312.37
          },
          {
            "text": "into",
            "start": 312.42,
            "end": 313.41
          },
          {
            "text": "connection",
            "start": 313.46,
            "end": 314.45
          },
          {
            "text": "pool",
            "start": 314.5,
            "end": 315.49
          },
          {
            "text": "exhaustion",
            "start": 315.54,
            "end": 316.52
          },
          {
            "text": "on",
            "start": 316.58,
            "end": 317.56
          },
          {
            "text": "our",
            "start": 317.62,
            "end": 318.6
          },
          {
            "text": "primary",
            "start": 318.65,
            "end": 319.64
          },
          {
            "text": "Aurora",
            "start": 319.69,
            "end": 320.68
          },
          {
            "text": "PostgreSQL",
            "start": 320.73,
            "end": 321.72
          },
          {
            "text": "cluster",
            "start": 321.77,
            "end": 322.76
          },
          {
            "text": "during",
            "start": 322.81,
            "end": 323.79
          },
          {
            "text": "the",
            "start": 323.85,
            "end": 324.83
          },
          {
            "text": "Acme",
            "start": 324.88,
            "end": 325.87
          },
          {
            "text": "enterprise",
            "start": 325.92,
            "end": 326.91
          },
          {
            "text": "proof-of-concept.",
            "start": 326.96,
            "end": 327.95
          }
        ]
      },
      {
        "id": "seg-1-014",
        "speakerId": "spk-2",
        "start": 329,
        "end": 355,
        "text": "The root cause was our application tier spinning up separate connection pools per pod rather than leveraging a centralized pooling proxy like PgBouncer or AWS RDS Proxy.",
        "words": [
          {
            "text": "The",
            "start": 329,
            "end": 329.91
          },
          {
            "text": "root",
            "start": 329.96,
            "end": 330.88
          },
          {
            "text": "cause",
            "start": 330.93,
            "end": 331.84
          },
          {
            "text": "was",
            "start": 331.89,
            "end": 332.8
          },
          {
            "text": "our",
            "start": 332.85,
            "end": 333.77
          },
          {
            "text": "application",
            "start": 333.81,
            "end": 334.73
          },
          {
            "text": "tier",
            "start": 334.78,
            "end": 335.69
          },
          {
            "text": "spinning",
            "start": 335.74,
            "end": 336.66
          },
          {
            "text": "up",
            "start": 336.7,
            "end": 337.62
          },
          {
            "text": "separate",
            "start": 337.67,
            "end": 338.58
          },
          {
            "text": "connection",
            "start": 338.63,
            "end": 339.54
          },
          {
            "text": "pools",
            "start": 339.59,
            "end": 340.51
          },
          {
            "text": "per",
            "start": 340.56,
            "end": 341.47
          },
          {
            "text": "pod",
            "start": 341.52,
            "end": 342.43
          },
          {
            "text": "rather",
            "start": 342.48,
            "end": 343.4
          },
          {
            "text": "than",
            "start": 343.44,
            "end": 344.36
          },
          {
            "text": "leveraging",
            "start": 344.41,
            "end": 345.32
          },
          {
            "text": "a",
            "start": 345.37,
            "end": 346.29
          },
          {
            "text": "centralized",
            "start": 346.33,
            "end": 347.25
          },
          {
            "text": "pooling",
            "start": 347.3,
            "end": 348.21
          },
          {
            "text": "proxy",
            "start": 348.26,
            "end": 349.17
          },
          {
            "text": "like",
            "start": 349.22,
            "end": 350.14
          },
          {
            "text": "PgBouncer",
            "start": 350.19,
            "end": 351.1
          },
          {
            "text": "or",
            "start": 351.15,
            "end": 352.06
          },
          {
            "text": "AWS",
            "start": 352.11,
            "end": 353.03
          },
          {
            "text": "RDS",
            "start": 353.07,
            "end": 353.99
          },
          {
            "text": "Proxy.",
            "start": 354.04,
            "end": 354.95
          }
        ]
      },
      {
        "id": "seg-1-015",
        "speakerId": "spk-4",
        "start": 357,
        "end": 381,
        "text": "When we scaled to one hundred and fifty replica pods, we exceeded the max connections limit on the db.r6g.8xlarge instance within thirty seconds.",
        "words": [
          {
            "text": "When",
            "start": 357,
            "end": 357.99
          },
          {
            "text": "we",
            "start": 358.04,
            "end": 359.03
          },
          {
            "text": "scaled",
            "start": 359.09,
            "end": 360.08
          },
          {
            "text": "to",
            "start": 360.13,
            "end": 361.12
          },
          {
            "text": "one",
            "start": 361.17,
            "end": 362.17
          },
          {
            "text": "hundred",
            "start": 362.22,
            "end": 363.21
          },
          {
            "text": "and",
            "start": 363.26,
            "end": 364.25
          },
          {
            "text": "fifty",
            "start": 364.3,
            "end": 365.3
          },
          {
            "text": "replica",
            "start": 365.35,
            "end": 366.34
          },
          {
            "text": "pods,",
            "start": 366.39,
            "end": 367.38
          },
          {
            "text": "we",
            "start": 367.43,
            "end": 368.43
          },
          {
            "text": "exceeded",
            "start": 368.48,
            "end": 369.47
          },
          {
            "text": "the",
            "start": 369.52,
            "end": 370.51
          },
          {
            "text": "max",
            "start": 370.57,
            "end": 371.56
          },
          {
            "text": "connections",
            "start": 371.61,
            "end": 372.6
          },
          {
            "text": "limit",
            "start": 372.65,
            "end": 373.64
          },
          {
            "text": "on",
            "start": 373.7,
            "end": 374.69
          },
          {
            "text": "the",
            "start": 374.74,
            "end": 375.73
          },
          {
            "text": "db.r6g.8xlarge",
            "start": 375.78,
            "end": 376.77
          },
          {
            "text": "instance",
            "start": 376.83,
            "end": 377.82
          },
          {
            "text": "within",
            "start": 377.87,
            "end": 378.86
          },
          {
            "text": "thirty",
            "start": 378.91,
            "end": 379.9
          },
          {
            "text": "seconds.",
            "start": 379.96,
            "end": 380.95
          }
        ]
      },
      {
        "id": "seg-1-016",
        "speakerId": "spk-1",
        "start": 384,
        "end": 411,
        "text": "Exactly. My recommendation is twofold: first, enforce RDS Proxy with transaction-level connection pooling, and second, offload all ephemeral meeting presence states to a Redis cluster.",
        "words": [
          {
            "text": "Exactly.",
            "start": 384,
            "end": 385.03
          },
          {
            "text": "My",
            "start": 385.08,
            "end": 386.11
          },
          {
            "text": "recommendation",
            "start": 386.16,
            "end": 387.19
          },
          {
            "text": "is",
            "start": 387.24,
            "end": 388.27
          },
          {
            "text": "twofold:",
            "start": 388.32,
            "end": 389.35
          },
          {
            "text": "first,",
            "start": 389.4,
            "end": 390.43
          },
          {
            "text": "enforce",
            "start": 390.48,
            "end": 391.51
          },
          {
            "text": "RDS",
            "start": 391.56,
            "end": 392.59
          },
          {
            "text": "Proxy",
            "start": 392.64,
            "end": 393.67
          },
          {
            "text": "with",
            "start": 393.72,
            "end": 394.75
          },
          {
            "text": "transaction-level",
            "start": 394.8,
            "end": 395.83
          },
          {
            "text": "connection",
            "start": 395.88,
            "end": 396.91
          },
          {
            "text": "pooling,",
            "start": 396.96,
            "end": 397.99
          },
          {
            "text": "and",
            "start": 398.04,
            "end": 399.07
          },
          {
            "text": "second,",
            "start": 399.12,
            "end": 400.15
          },
          {
            "text": "offload",
            "start": 400.2,
            "end": 401.23
          },
          {
            "text": "all",
            "start": 401.28,
            "end": 402.31
          },
          {
            "text": "ephemeral",
            "start": 402.36,
            "end": 403.39
          },
          {
            "text": "meeting",
            "start": 403.44,
            "end": 404.47
          },
          {
            "text": "presence",
            "start": 404.52,
            "end": 405.55
          },
          {
            "text": "states",
            "start": 405.6,
            "end": 406.63
          },
          {
            "text": "to",
            "start": 406.68,
            "end": 407.71
          },
          {
            "text": "a",
            "start": 407.76,
            "end": 408.79
          },
          {
            "text": "Redis",
            "start": 408.84,
            "end": 409.87
          },
          {
            "text": "cluster.",
            "start": 409.92,
            "end": 410.95
          }
        ]
      },
      {
        "id": "seg-1-017",
        "speakerId": "spk-6",
        "start": 413,
        "end": 437,
        "text": "What kind of throughput are you expecting on the Redis cluster for presence heartbeats and cursor sync Sarah? We need to size the read replicas properly.",
        "words": [
          {
            "text": "What",
            "start": 413,
            "end": 413.88
          },
          {
            "text": "kind",
            "start": 413.92,
            "end": 414.8
          },
          {
            "text": "of",
            "start": 414.85,
            "end": 415.72
          },
          {
            "text": "throughput",
            "start": 415.77,
            "end": 416.65
          },
          {
            "text": "are",
            "start": 416.69,
            "end": 417.57
          },
          {
            "text": "you",
            "start": 417.62,
            "end": 418.49
          },
          {
            "text": "expecting",
            "start": 418.54,
            "end": 419.42
          },
          {
            "text": "on",
            "start": 419.46,
            "end": 420.34
          },
          {
            "text": "the",
            "start": 420.38,
            "end": 421.26
          },
          {
            "text": "Redis",
            "start": 421.31,
            "end": 422.18
          },
          {
            "text": "cluster",
            "start": 422.23,
            "end": 423.11
          },
          {
            "text": "for",
            "start": 423.15,
            "end": 424.03
          },
          {
            "text": "presence",
            "start": 424.08,
            "end": 424.95
          },
          {
            "text": "heartbeats",
            "start": 425,
            "end": 425.88
          },
          {
            "text": "and",
            "start": 425.92,
            "end": 426.8
          },
          {
            "text": "cursor",
            "start": 426.85,
            "end": 427.72
          },
          {
            "text": "sync",
            "start": 427.77,
            "end": 428.65
          },
          {
            "text": "Sarah?",
            "start": 428.69,
            "end": 429.57
          },
          {
            "text": "We",
            "start": 429.62,
            "end": 430.49
          },
          {
            "text": "need",
            "start": 430.54,
            "end": 431.42
          },
          {
            "text": "to",
            "start": 431.46,
            "end": 432.34
          },
          {
            "text": "size",
            "start": 432.38,
            "end": 433.26
          },
          {
            "text": "the",
            "start": 433.31,
            "end": 434.18
          },
          {
            "text": "read",
            "start": 434.23,
            "end": 435.11
          },
          {
            "text": "replicas",
            "start": 435.15,
            "end": 436.03
          },
          {
            "text": "properly.",
            "start": 436.08,
            "end": 436.95
          }
        ]
      },
      {
        "id": "seg-1-018",
        "speakerId": "spk-1",
        "start": 440,
        "end": 467,
        "text": "We modeled fifty thousand requests per second at peak. I want to run a formal load testing benchmark on the Redis cluster with that fifty-k RPS target to measure p99 latency.",
        "words": [
          {
            "text": "We",
            "start": 440,
            "end": 440.83
          },
          {
            "text": "modeled",
            "start": 440.87,
            "end": 441.7
          },
          {
            "text": "fifty",
            "start": 441.74,
            "end": 442.57
          },
          {
            "text": "thousand",
            "start": 442.61,
            "end": 443.44
          },
          {
            "text": "requests",
            "start": 443.48,
            "end": 444.31
          },
          {
            "text": "per",
            "start": 444.35,
            "end": 445.18
          },
          {
            "text": "second",
            "start": 445.23,
            "end": 446.05
          },
          {
            "text": "at",
            "start": 446.1,
            "end": 446.92
          },
          {
            "text": "peak.",
            "start": 446.97,
            "end": 447.8
          },
          {
            "text": "I",
            "start": 447.84,
            "end": 448.67
          },
          {
            "text": "want",
            "start": 448.71,
            "end": 449.54
          },
          {
            "text": "to",
            "start": 449.58,
            "end": 450.41
          },
          {
            "text": "run",
            "start": 450.45,
            "end": 451.28
          },
          {
            "text": "a",
            "start": 451.32,
            "end": 452.15
          },
          {
            "text": "formal",
            "start": 452.19,
            "end": 453.02
          },
          {
            "text": "load",
            "start": 453.06,
            "end": 453.89
          },
          {
            "text": "testing",
            "start": 453.94,
            "end": 454.76
          },
          {
            "text": "benchmark",
            "start": 454.81,
            "end": 455.63
          },
          {
            "text": "on",
            "start": 455.68,
            "end": 456.5
          },
          {
            "text": "the",
            "start": 456.55,
            "end": 457.38
          },
          {
            "text": "Redis",
            "start": 457.42,
            "end": 458.25
          },
          {
            "text": "cluster",
            "start": 458.29,
            "end": 459.12
          },
          {
            "text": "with",
            "start": 459.16,
            "end": 459.99
          },
          {
            "text": "that",
            "start": 460.03,
            "end": 460.86
          },
          {
            "text": "fifty-k",
            "start": 460.9,
            "end": 461.73
          },
          {
            "text": "RPS",
            "start": 461.77,
            "end": 462.6
          },
          {
            "text": "target",
            "start": 462.65,
            "end": 463.47
          },
          {
            "text": "to",
            "start": 463.52,
            "end": 464.34
          },
          {
            "text": "measure",
            "start": 464.39,
            "end": 465.21
          },
          {
            "text": "p99",
            "start": 465.26,
            "end": 466.09
          },
          {
            "text": "latency.",
            "start": 466.13,
            "end": 466.96
          }
        ]
      },
      {
        "id": "seg-1-019",
        "speakerId": "spk-4",
        "start": 468,
        "end": 493,
        "text": "Should we deploy Redis in Cluster mode with hash slots or rely on Redis Sentinel with active-passive failover?",
        "words": [
          {
            "text": "Should",
            "start": 468,
            "end": 469.32
          },
          {
            "text": "we",
            "start": 469.39,
            "end": 470.71
          },
          {
            "text": "deploy",
            "start": 470.78,
            "end": 472.1
          },
          {
            "text": "Redis",
            "start": 472.17,
            "end": 473.49
          },
          {
            "text": "in",
            "start": 473.56,
            "end": 474.88
          },
          {
            "text": "Cluster",
            "start": 474.94,
            "end": 476.26
          },
          {
            "text": "mode",
            "start": 476.33,
            "end": 477.65
          },
          {
            "text": "with",
            "start": 477.72,
            "end": 479.04
          },
          {
            "text": "hash",
            "start": 479.11,
            "end": 480.43
          },
          {
            "text": "slots",
            "start": 480.5,
            "end": 481.82
          },
          {
            "text": "or",
            "start": 481.89,
            "end": 483.21
          },
          {
            "text": "rely",
            "start": 483.28,
            "end": 484.6
          },
          {
            "text": "on",
            "start": 484.67,
            "end": 485.99
          },
          {
            "text": "Redis",
            "start": 486.06,
            "end": 487.38
          },
          {
            "text": "Sentinel",
            "start": 487.44,
            "end": 488.76
          },
          {
            "text": "with",
            "start": 488.83,
            "end": 490.15
          },
          {
            "text": "active-passive",
            "start": 490.22,
            "end": 491.54
          },
          {
            "text": "failover?",
            "start": 491.61,
            "end": 492.93
          }
        ]
      },
      {
        "id": "seg-1-020",
        "speakerId": "spk-1",
        "start": 495,
        "end": 519,
        "text": "Cluster mode is essential because Sentinel cannot shard memory across nodes. With fifty-k RPS, a single master would saturate CPU on serialization.",
        "words": [
          {
            "text": "Cluster",
            "start": 495,
            "end": 496.04
          },
          {
            "text": "mode",
            "start": 496.09,
            "end": 497.13
          },
          {
            "text": "is",
            "start": 497.18,
            "end": 498.22
          },
          {
            "text": "essential",
            "start": 498.27,
            "end": 499.31
          },
          {
            "text": "because",
            "start": 499.36,
            "end": 500.4
          },
          {
            "text": "Sentinel",
            "start": 500.45,
            "end": 501.49
          },
          {
            "text": "cannot",
            "start": 501.55,
            "end": 502.58
          },
          {
            "text": "shard",
            "start": 502.64,
            "end": 503.67
          },
          {
            "text": "memory",
            "start": 503.73,
            "end": 504.76
          },
          {
            "text": "across",
            "start": 504.82,
            "end": 505.85
          },
          {
            "text": "nodes.",
            "start": 505.91,
            "end": 506.95
          },
          {
            "text": "With",
            "start": 507,
            "end": 508.04
          },
          {
            "text": "fifty-k",
            "start": 508.09,
            "end": 509.13
          },
          {
            "text": "RPS,",
            "start": 509.18,
            "end": 510.22
          },
          {
            "text": "a",
            "start": 510.27,
            "end": 511.31
          },
          {
            "text": "single",
            "start": 511.36,
            "end": 512.4
          },
          {
            "text": "master",
            "start": 512.45,
            "end": 513.49
          },
          {
            "text": "would",
            "start": 513.55,
            "end": 514.58
          },
          {
            "text": "saturate",
            "start": 514.64,
            "end": 515.67
          },
          {
            "text": "CPU",
            "start": 515.73,
            "end": 516.76
          },
          {
            "text": "on",
            "start": 516.82,
            "end": 517.85
          },
          {
            "text": "serialization.",
            "start": 517.91,
            "end": 518.95
          }
        ]
      },
      {
        "id": "seg-1-021",
        "speakerId": "spk-5",
        "start": 520,
        "end": 545,
        "text": "The QA automation pipeline can orchestrate that load test using k6 distributed across five worker nodes. We will monitor the memory fragmentation ratio and eviction rates.",
        "words": [
          {
            "text": "The",
            "start": 520,
            "end": 520.91
          },
          {
            "text": "QA",
            "start": 520.96,
            "end": 521.88
          },
          {
            "text": "automation",
            "start": 521.92,
            "end": 522.84
          },
          {
            "text": "pipeline",
            "start": 522.88,
            "end": 523.8
          },
          {
            "text": "can",
            "start": 523.85,
            "end": 524.76
          },
          {
            "text": "orchestrate",
            "start": 524.81,
            "end": 525.72
          },
          {
            "text": "that",
            "start": 525.77,
            "end": 526.68
          },
          {
            "text": "load",
            "start": 526.73,
            "end": 527.64
          },
          {
            "text": "test",
            "start": 527.69,
            "end": 528.61
          },
          {
            "text": "using",
            "start": 528.65,
            "end": 529.57
          },
          {
            "text": "k6",
            "start": 529.62,
            "end": 530.53
          },
          {
            "text": "distributed",
            "start": 530.58,
            "end": 531.49
          },
          {
            "text": "across",
            "start": 531.54,
            "end": 532.45
          },
          {
            "text": "five",
            "start": 532.5,
            "end": 533.41
          },
          {
            "text": "worker",
            "start": 533.46,
            "end": 534.38
          },
          {
            "text": "nodes.",
            "start": 534.42,
            "end": 535.34
          },
          {
            "text": "We",
            "start": 535.38,
            "end": 536.3
          },
          {
            "text": "will",
            "start": 536.35,
            "end": 537.26
          },
          {
            "text": "monitor",
            "start": 537.31,
            "end": 538.22
          },
          {
            "text": "the",
            "start": 538.27,
            "end": 539.18
          },
          {
            "text": "memory",
            "start": 539.23,
            "end": 540.14
          },
          {
            "text": "fragmentation",
            "start": 540.19,
            "end": 541.11
          },
          {
            "text": "ratio",
            "start": 541.15,
            "end": 542.07
          },
          {
            "text": "and",
            "start": 542.12,
            "end": 543.03
          },
          {
            "text": "eviction",
            "start": 543.08,
            "end": 543.99
          },
          {
            "text": "rates.",
            "start": 544.04,
            "end": 544.95
          }
        ]
      },
      {
        "id": "seg-1-022",
        "speakerId": "spk-3",
        "start": 546,
        "end": 570,
        "text": "Sarah, please lead that benchmark with Elena. Can we have preliminary findings by next Friday? That will inform our sizing budget for Q3.",
        "words": [
          {
            "text": "Sarah,",
            "start": 546,
            "end": 546.99
          },
          {
            "text": "please",
            "start": 547.04,
            "end": 548.03
          },
          {
            "text": "lead",
            "start": 548.09,
            "end": 549.08
          },
          {
            "text": "that",
            "start": 549.13,
            "end": 550.12
          },
          {
            "text": "benchmark",
            "start": 550.17,
            "end": 551.17
          },
          {
            "text": "with",
            "start": 551.22,
            "end": 552.21
          },
          {
            "text": "Elena.",
            "start": 552.26,
            "end": 553.25
          },
          {
            "text": "Can",
            "start": 553.3,
            "end": 554.3
          },
          {
            "text": "we",
            "start": 554.35,
            "end": 555.34
          },
          {
            "text": "have",
            "start": 555.39,
            "end": 556.38
          },
          {
            "text": "preliminary",
            "start": 556.43,
            "end": 557.43
          },
          {
            "text": "findings",
            "start": 557.48,
            "end": 558.47
          },
          {
            "text": "by",
            "start": 558.52,
            "end": 559.51
          },
          {
            "text": "next",
            "start": 559.57,
            "end": 560.56
          },
          {
            "text": "Friday?",
            "start": 560.61,
            "end": 561.6
          },
          {
            "text": "That",
            "start": 561.65,
            "end": 562.64
          },
          {
            "text": "will",
            "start": 562.7,
            "end": 563.69
          },
          {
            "text": "inform",
            "start": 563.74,
            "end": 564.73
          },
          {
            "text": "our",
            "start": 564.78,
            "end": 565.77
          },
          {
            "text": "sizing",
            "start": 565.83,
            "end": 566.82
          },
          {
            "text": "budget",
            "start": 566.87,
            "end": 567.86
          },
          {
            "text": "for",
            "start": 567.91,
            "end": 568.9
          },
          {
            "text": "Q3.",
            "start": 568.96,
            "end": 569.95
          }
        ]
      },
      {
        "id": "seg-1-023",
        "speakerId": "spk-1",
        "start": 572,
        "end": 595,
        "text": "Yes, absolutely. I will commit to delivering that benchmark report by September twentieth. We will include latency histograms and connection failure rates.",
        "words": [
          {
            "text": "Yes,",
            "start": 572,
            "end": 572.99
          },
          {
            "text": "absolutely.",
            "start": 573.05,
            "end": 574.04
          },
          {
            "text": "I",
            "start": 574.09,
            "end": 575.08
          },
          {
            "text": "will",
            "start": 575.14,
            "end": 576.13
          },
          {
            "text": "commit",
            "start": 576.18,
            "end": 577.17
          },
          {
            "text": "to",
            "start": 577.23,
            "end": 578.22
          },
          {
            "text": "delivering",
            "start": 578.27,
            "end": 579.27
          },
          {
            "text": "that",
            "start": 579.32,
            "end": 580.31
          },
          {
            "text": "benchmark",
            "start": 580.36,
            "end": 581.36
          },
          {
            "text": "report",
            "start": 581.41,
            "end": 582.4
          },
          {
            "text": "by",
            "start": 582.45,
            "end": 583.45
          },
          {
            "text": "September",
            "start": 583.5,
            "end": 584.49
          },
          {
            "text": "twentieth.",
            "start": 584.55,
            "end": 585.54
          },
          {
            "text": "We",
            "start": 585.59,
            "end": 586.58
          },
          {
            "text": "will",
            "start": 586.64,
            "end": 587.63
          },
          {
            "text": "include",
            "start": 587.68,
            "end": 588.67
          },
          {
            "text": "latency",
            "start": 588.73,
            "end": 589.72
          },
          {
            "text": "histograms",
            "start": 589.77,
            "end": 590.77
          },
          {
            "text": "and",
            "start": 590.82,
            "end": 591.81
          },
          {
            "text": "connection",
            "start": 591.86,
            "end": 592.86
          },
          {
            "text": "failure",
            "start": 592.91,
            "end": 593.9
          },
          {
            "text": "rates.",
            "start": 593.95,
            "end": 594.95
          }
        ]
      },
      {
        "id": "seg-1-024",
        "speakerId": "spk-4",
        "start": 597,
        "end": 622,
        "text": "I will ensure the Redis cluster deployment in Terraform has cluster-mode enabled with three shards and multi-AZ automatic failover configured in staging.",
        "words": [
          {
            "text": "I",
            "start": 597,
            "end": 598.08
          },
          {
            "text": "will",
            "start": 598.14,
            "end": 599.22
          },
          {
            "text": "ensure",
            "start": 599.27,
            "end": 600.35
          },
          {
            "text": "the",
            "start": 600.41,
            "end": 601.49
          },
          {
            "text": "Redis",
            "start": 601.55,
            "end": 602.63
          },
          {
            "text": "cluster",
            "start": 602.68,
            "end": 603.76
          },
          {
            "text": "deployment",
            "start": 603.82,
            "end": 604.9
          },
          {
            "text": "in",
            "start": 604.95,
            "end": 606.03
          },
          {
            "text": "Terraform",
            "start": 606.09,
            "end": 607.17
          },
          {
            "text": "has",
            "start": 607.23,
            "end": 608.31
          },
          {
            "text": "cluster-mode",
            "start": 608.36,
            "end": 609.44
          },
          {
            "text": "enabled",
            "start": 609.5,
            "end": 610.58
          },
          {
            "text": "with",
            "start": 610.64,
            "end": 611.72
          },
          {
            "text": "three",
            "start": 611.77,
            "end": 612.85
          },
          {
            "text": "shards",
            "start": 612.91,
            "end": 613.99
          },
          {
            "text": "and",
            "start": 614.05,
            "end": 615.13
          },
          {
            "text": "multi-AZ",
            "start": 615.18,
            "end": 616.26
          },
          {
            "text": "automatic",
            "start": 616.32,
            "end": 617.4
          },
          {
            "text": "failover",
            "start": 617.45,
            "end": 618.53
          },
          {
            "text": "configured",
            "start": 618.59,
            "end": 619.67
          },
          {
            "text": "in",
            "start": 619.73,
            "end": 620.81
          },
          {
            "text": "staging.",
            "start": 620.86,
            "end": 621.94
          }
        ]
      },
      {
        "id": "seg-1-025",
        "speakerId": "spk-2",
        "start": 625,
        "end": 652,
        "text": "Now moving to our long-term database architecture. While RDS Proxy solves the immediate connection ceiling, we remain tied to a single primary write region in us-east-1.",
        "words": [
          {
            "text": "Now",
            "start": 625,
            "end": 625.99
          },
          {
            "text": "moving",
            "start": 626.04,
            "end": 627.02
          },
          {
            "text": "to",
            "start": 627.08,
            "end": 628.06
          },
          {
            "text": "our",
            "start": 628.12,
            "end": 629.1
          },
          {
            "text": "long-term",
            "start": 629.15,
            "end": 630.14
          },
          {
            "text": "database",
            "start": 630.19,
            "end": 631.18
          },
          {
            "text": "architecture.",
            "start": 631.23,
            "end": 632.22
          },
          {
            "text": "While",
            "start": 632.27,
            "end": 633.26
          },
          {
            "text": "RDS",
            "start": 633.31,
            "end": 634.29
          },
          {
            "text": "Proxy",
            "start": 634.35,
            "end": 635.33
          },
          {
            "text": "solves",
            "start": 635.38,
            "end": 636.37
          },
          {
            "text": "the",
            "start": 636.42,
            "end": 637.41
          },
          {
            "text": "immediate",
            "start": 637.46,
            "end": 638.45
          },
          {
            "text": "connection",
            "start": 638.5,
            "end": 639.49
          },
          {
            "text": "ceiling,",
            "start": 639.54,
            "end": 640.52
          },
          {
            "text": "we",
            "start": 640.58,
            "end": 641.56
          },
          {
            "text": "remain",
            "start": 641.62,
            "end": 642.6
          },
          {
            "text": "tied",
            "start": 642.65,
            "end": 643.64
          },
          {
            "text": "to",
            "start": 643.69,
            "end": 644.68
          },
          {
            "text": "a",
            "start": 644.73,
            "end": 645.72
          },
          {
            "text": "single",
            "start": 645.77,
            "end": 646.76
          },
          {
            "text": "primary",
            "start": 646.81,
            "end": 647.79
          },
          {
            "text": "write",
            "start": 647.85,
            "end": 648.83
          },
          {
            "text": "region",
            "start": 648.88,
            "end": 649.87
          },
          {
            "text": "in",
            "start": 649.92,
            "end": 650.91
          },
          {
            "text": "us-east-1.",
            "start": 650.96,
            "end": 651.95
          }
        ]
      },
      {
        "id": "seg-1-026",
        "speakerId": "spk-8",
        "start": 654,
        "end": 681,
        "text": "That single-region constraint is a major vulnerability for enterprise sales. Our tier-one financial customers are asking for cross-region disaster recovery with RPO under five seconds.",
        "words": [
          {
            "text": "That",
            "start": 654,
            "end": 655.03
          },
          {
            "text": "single-region",
            "start": 655.08,
            "end": 656.11
          },
          {
            "text": "constraint",
            "start": 656.16,
            "end": 657.19
          },
          {
            "text": "is",
            "start": 657.24,
            "end": 658.27
          },
          {
            "text": "a",
            "start": 658.32,
            "end": 659.35
          },
          {
            "text": "major",
            "start": 659.4,
            "end": 660.43
          },
          {
            "text": "vulnerability",
            "start": 660.48,
            "end": 661.51
          },
          {
            "text": "for",
            "start": 661.56,
            "end": 662.59
          },
          {
            "text": "enterprise",
            "start": 662.64,
            "end": 663.67
          },
          {
            "text": "sales.",
            "start": 663.72,
            "end": 664.75
          },
          {
            "text": "Our",
            "start": 664.8,
            "end": 665.83
          },
          {
            "text": "tier-one",
            "start": 665.88,
            "end": 666.91
          },
          {
            "text": "financial",
            "start": 666.96,
            "end": 667.99
          },
          {
            "text": "customers",
            "start": 668.04,
            "end": 669.07
          },
          {
            "text": "are",
            "start": 669.12,
            "end": 670.15
          },
          {
            "text": "asking",
            "start": 670.2,
            "end": 671.23
          },
          {
            "text": "for",
            "start": 671.28,
            "end": 672.31
          },
          {
            "text": "cross-region",
            "start": 672.36,
            "end": 673.39
          },
          {
            "text": "disaster",
            "start": 673.44,
            "end": 674.47
          },
          {
            "text": "recovery",
            "start": 674.52,
            "end": 675.55
          },
          {
            "text": "with",
            "start": 675.6,
            "end": 676.63
          },
          {
            "text": "RPO",
            "start": 676.68,
            "end": 677.71
          },
          {
            "text": "under",
            "start": 677.76,
            "end": 678.79
          },
          {
            "text": "five",
            "start": 678.84,
            "end": 679.87
          },
          {
            "text": "seconds.",
            "start": 679.92,
            "end": 680.95
          }
        ]
      },
      {
        "id": "seg-1-027",
        "speakerId": "spk-2",
        "start": 684,
        "end": 711,
        "text": "Precisely. Over the past three weeks, I have been prototyping an active-active distributed SQL topology using CockroachDB v24 across us-east, us-west, and eu-central.",
        "words": [
          {
            "text": "Precisely.",
            "start": 684,
            "end": 685.12
          },
          {
            "text": "Over",
            "start": 685.17,
            "end": 686.29
          },
          {
            "text": "the",
            "start": 686.35,
            "end": 687.46
          },
          {
            "text": "past",
            "start": 687.52,
            "end": 688.64
          },
          {
            "text": "three",
            "start": 688.7,
            "end": 689.81
          },
          {
            "text": "weeks,",
            "start": 689.87,
            "end": 690.98
          },
          {
            "text": "I",
            "start": 691.04,
            "end": 692.16
          },
          {
            "text": "have",
            "start": 692.22,
            "end": 693.33
          },
          {
            "text": "been",
            "start": 693.39,
            "end": 694.51
          },
          {
            "text": "prototyping",
            "start": 694.57,
            "end": 695.68
          },
          {
            "text": "an",
            "start": 695.74,
            "end": 696.85
          },
          {
            "text": "active-active",
            "start": 696.91,
            "end": 698.03
          },
          {
            "text": "distributed",
            "start": 698.09,
            "end": 699.2
          },
          {
            "text": "SQL",
            "start": 699.26,
            "end": 700.38
          },
          {
            "text": "topology",
            "start": 700.43,
            "end": 701.55
          },
          {
            "text": "using",
            "start": 701.61,
            "end": 702.72
          },
          {
            "text": "CockroachDB",
            "start": 702.78,
            "end": 703.9
          },
          {
            "text": "v24",
            "start": 703.96,
            "end": 705.07
          },
          {
            "text": "across",
            "start": 705.13,
            "end": 706.25
          },
          {
            "text": "us-east,",
            "start": 706.3,
            "end": 707.42
          },
          {
            "text": "us-west,",
            "start": 707.48,
            "end": 708.59
          },
          {
            "text": "and",
            "start": 708.65,
            "end": 709.77
          },
          {
            "text": "eu-central.",
            "start": 709.83,
            "end": 710.94
          }
        ]
      },
      {
        "id": "seg-1-028",
        "speakerId": "spk-3",
        "start": 713,
        "end": 739,
        "text": "How does distributed consensus impact write latency for real-time meeting transcripts? That is our primary core product workflow.",
        "words": [
          {
            "text": "How",
            "start": 713,
            "end": 714.37
          },
          {
            "text": "does",
            "start": 714.44,
            "end": 715.82
          },
          {
            "text": "distributed",
            "start": 715.89,
            "end": 717.26
          },
          {
            "text": "consensus",
            "start": 717.33,
            "end": 718.71
          },
          {
            "text": "impact",
            "start": 718.78,
            "end": 720.15
          },
          {
            "text": "write",
            "start": 720.22,
            "end": 721.59
          },
          {
            "text": "latency",
            "start": 721.67,
            "end": 723.04
          },
          {
            "text": "for",
            "start": 723.11,
            "end": 724.48
          },
          {
            "text": "real-time",
            "start": 724.56,
            "end": 725.93
          },
          {
            "text": "meeting",
            "start": 726,
            "end": 727.37
          },
          {
            "text": "transcripts?",
            "start": 727.44,
            "end": 728.82
          },
          {
            "text": "That",
            "start": 728.89,
            "end": 730.26
          },
          {
            "text": "is",
            "start": 730.33,
            "end": 731.71
          },
          {
            "text": "our",
            "start": 731.78,
            "end": 733.15
          },
          {
            "text": "primary",
            "start": 733.22,
            "end": 734.59
          },
          {
            "text": "core",
            "start": 734.67,
            "end": 736.04
          },
          {
            "text": "product",
            "start": 736.11,
            "end": 737.48
          },
          {
            "text": "workflow.",
            "start": 737.56,
            "end": 738.93
          }
        ]
      },
      {
        "id": "seg-1-029",
        "speakerId": "spk-2",
        "start": 741,
        "end": 771,
        "text": "CockroachDB uses Raft consensus on range leases. For localized tables where data is partitioned by organization ID, writes complete within eighteen milliseconds, which is virtually identical to Aurora.",
        "words": [
          {
            "text": "CockroachDB",
            "start": 741,
            "end": 742.02
          },
          {
            "text": "uses",
            "start": 742.07,
            "end": 743.09
          },
          {
            "text": "Raft",
            "start": 743.14,
            "end": 744.16
          },
          {
            "text": "consensus",
            "start": 744.21,
            "end": 745.23
          },
          {
            "text": "on",
            "start": 745.29,
            "end": 746.3
          },
          {
            "text": "range",
            "start": 746.36,
            "end": 747.38
          },
          {
            "text": "leases.",
            "start": 747.43,
            "end": 748.45
          },
          {
            "text": "For",
            "start": 748.5,
            "end": 749.52
          },
          {
            "text": "localized",
            "start": 749.57,
            "end": 750.59
          },
          {
            "text": "tables",
            "start": 750.64,
            "end": 751.66
          },
          {
            "text": "where",
            "start": 751.71,
            "end": 752.73
          },
          {
            "text": "data",
            "start": 752.79,
            "end": 753.8
          },
          {
            "text": "is",
            "start": 753.86,
            "end": 754.88
          },
          {
            "text": "partitioned",
            "start": 754.93,
            "end": 755.95
          },
          {
            "text": "by",
            "start": 756,
            "end": 757.02
          },
          {
            "text": "organization",
            "start": 757.07,
            "end": 758.09
          },
          {
            "text": "ID,",
            "start": 758.14,
            "end": 759.16
          },
          {
            "text": "writes",
            "start": 759.21,
            "end": 760.23
          },
          {
            "text": "complete",
            "start": 760.29,
            "end": 761.3
          },
          {
            "text": "within",
            "start": 761.36,
            "end": 762.38
          },
          {
            "text": "eighteen",
            "start": 762.43,
            "end": 763.45
          },
          {
            "text": "milliseconds,",
            "start": 763.5,
            "end": 764.52
          },
          {
            "text": "which",
            "start": 764.57,
            "end": 765.59
          },
          {
            "text": "is",
            "start": 765.64,
            "end": 766.66
          },
          {
            "text": "virtually",
            "start": 766.71,
            "end": 767.73
          },
          {
            "text": "identical",
            "start": 767.79,
            "end": 768.8
          },
          {
            "text": "to",
            "start": 768.86,
            "end": 769.88
          },
          {
            "text": "Aurora.",
            "start": 769.93,
            "end": 770.95
          }
        ]
      },
      {
        "id": "seg-1-030",
        "speakerId": "spk-6",
        "start": 773,
        "end": 800,
        "text": "And for cross-region reads, follower reads allow us to serve transcript queries from local replicas with sub-five-millisecond response times without hitting cross-region WAN links.",
        "words": [
          {
            "text": "And",
            "start": 773,
            "end": 774.07
          },
          {
            "text": "for",
            "start": 774.13,
            "end": 775.19
          },
          {
            "text": "cross-region",
            "start": 775.25,
            "end": 776.32
          },
          {
            "text": "reads,",
            "start": 776.38,
            "end": 777.44
          },
          {
            "text": "follower",
            "start": 777.5,
            "end": 778.57
          },
          {
            "text": "reads",
            "start": 778.63,
            "end": 779.69
          },
          {
            "text": "allow",
            "start": 779.75,
            "end": 780.82
          },
          {
            "text": "us",
            "start": 780.88,
            "end": 781.94
          },
          {
            "text": "to",
            "start": 782,
            "end": 783.07
          },
          {
            "text": "serve",
            "start": 783.13,
            "end": 784.19
          },
          {
            "text": "transcript",
            "start": 784.25,
            "end": 785.32
          },
          {
            "text": "queries",
            "start": 785.38,
            "end": 786.44
          },
          {
            "text": "from",
            "start": 786.5,
            "end": 787.57
          },
          {
            "text": "local",
            "start": 787.63,
            "end": 788.69
          },
          {
            "text": "replicas",
            "start": 788.75,
            "end": 789.82
          },
          {
            "text": "with",
            "start": 789.88,
            "end": 790.94
          },
          {
            "text": "sub-five-millisecond",
            "start": 791,
            "end": 792.07
          },
          {
            "text": "response",
            "start": 792.13,
            "end": 793.19
          },
          {
            "text": "times",
            "start": 793.25,
            "end": 794.32
          },
          {
            "text": "without",
            "start": 794.38,
            "end": 795.44
          },
          {
            "text": "hitting",
            "start": 795.5,
            "end": 796.57
          },
          {
            "text": "cross-region",
            "start": 796.63,
            "end": 797.69
          },
          {
            "text": "WAN",
            "start": 797.75,
            "end": 798.82
          },
          {
            "text": "links.",
            "start": 798.88,
            "end": 799.94
          }
        ]
      },
      {
        "id": "seg-1-031",
        "speakerId": "spk-1",
        "start": 802,
        "end": 828,
        "text": "That is a huge architectural win. Alex, could you draft a comprehensive RFC covering schema migration, CDC replication pipelines, and cost modeling?",
        "words": [
          {
            "text": "That",
            "start": 802,
            "end": 803.12
          },
          {
            "text": "is",
            "start": 803.18,
            "end": 804.3
          },
          {
            "text": "a",
            "start": 804.36,
            "end": 805.49
          },
          {
            "text": "huge",
            "start": 805.55,
            "end": 806.67
          },
          {
            "text": "architectural",
            "start": 806.73,
            "end": 807.85
          },
          {
            "text": "win.",
            "start": 807.91,
            "end": 809.03
          },
          {
            "text": "Alex,",
            "start": 809.09,
            "end": 810.21
          },
          {
            "text": "could",
            "start": 810.27,
            "end": 811.4
          },
          {
            "text": "you",
            "start": 811.45,
            "end": 812.58
          },
          {
            "text": "draft",
            "start": 812.64,
            "end": 813.76
          },
          {
            "text": "a",
            "start": 813.82,
            "end": 814.94
          },
          {
            "text": "comprehensive",
            "start": 815,
            "end": 816.12
          },
          {
            "text": "RFC",
            "start": 816.18,
            "end": 817.3
          },
          {
            "text": "covering",
            "start": 817.36,
            "end": 818.49
          },
          {
            "text": "schema",
            "start": 818.55,
            "end": 819.67
          },
          {
            "text": "migration,",
            "start": 819.73,
            "end": 820.85
          },
          {
            "text": "CDC",
            "start": 820.91,
            "end": 822.03
          },
          {
            "text": "replication",
            "start": 822.09,
            "end": 823.21
          },
          {
            "text": "pipelines,",
            "start": 823.27,
            "end": 824.4
          },
          {
            "text": "and",
            "start": 824.45,
            "end": 825.58
          },
          {
            "text": "cost",
            "start": 825.64,
            "end": 826.76
          },
          {
            "text": "modeling?",
            "start": 826.82,
            "end": 827.94
          }
        ]
      },
      {
        "id": "seg-1-032",
        "speakerId": "spk-2",
        "start": 830,
        "end": 857,
        "text": "Yes, I will draft the RFC for the multi-region active-active CockroachDB migration strategy and publish it to Notion by September twenty-second.",
        "words": [
          {
            "text": "Yes,",
            "start": 830,
            "end": 831.22
          },
          {
            "text": "I",
            "start": 831.29,
            "end": 832.51
          },
          {
            "text": "will",
            "start": 832.57,
            "end": 833.79
          },
          {
            "text": "draft",
            "start": 833.86,
            "end": 835.08
          },
          {
            "text": "the",
            "start": 835.14,
            "end": 836.36
          },
          {
            "text": "RFC",
            "start": 836.43,
            "end": 837.65
          },
          {
            "text": "for",
            "start": 837.71,
            "end": 838.94
          },
          {
            "text": "the",
            "start": 839,
            "end": 840.22
          },
          {
            "text": "multi-region",
            "start": 840.29,
            "end": 841.51
          },
          {
            "text": "active-active",
            "start": 841.57,
            "end": 842.79
          },
          {
            "text": "CockroachDB",
            "start": 842.86,
            "end": 844.08
          },
          {
            "text": "migration",
            "start": 844.14,
            "end": 845.36
          },
          {
            "text": "strategy",
            "start": 845.43,
            "end": 846.65
          },
          {
            "text": "and",
            "start": 846.71,
            "end": 847.94
          },
          {
            "text": "publish",
            "start": 848,
            "end": 849.22
          },
          {
            "text": "it",
            "start": 849.29,
            "end": 850.51
          },
          {
            "text": "to",
            "start": 850.57,
            "end": 851.79
          },
          {
            "text": "Notion",
            "start": 851.86,
            "end": 853.08
          },
          {
            "text": "by",
            "start": 853.14,
            "end": 854.36
          },
          {
            "text": "September",
            "start": 854.43,
            "end": 855.65
          },
          {
            "text": "twenty-second.",
            "start": 855.71,
            "end": 856.94
          }
        ]
      },
      {
        "id": "seg-1-033",
        "speakerId": "spk-6",
        "start": 860,
        "end": 885,
        "text": "Alex, how will CockroachDB handle Change Data Capture into our Snowflake analytical warehouse for product analytics?",
        "words": [
          {
            "text": "Alex,",
            "start": 860,
            "end": 861.48
          },
          {
            "text": "how",
            "start": 861.56,
            "end": 863.05
          },
          {
            "text": "will",
            "start": 863.13,
            "end": 864.61
          },
          {
            "text": "CockroachDB",
            "start": 864.69,
            "end": 866.17
          },
          {
            "text": "handle",
            "start": 866.25,
            "end": 867.73
          },
          {
            "text": "Change",
            "start": 867.81,
            "end": 869.3
          },
          {
            "text": "Data",
            "start": 869.38,
            "end": 870.86
          },
          {
            "text": "Capture",
            "start": 870.94,
            "end": 872.42
          },
          {
            "text": "into",
            "start": 872.5,
            "end": 873.98
          },
          {
            "text": "our",
            "start": 874.06,
            "end": 875.55
          },
          {
            "text": "Snowflake",
            "start": 875.63,
            "end": 877.11
          },
          {
            "text": "analytical",
            "start": 877.19,
            "end": 878.67
          },
          {
            "text": "warehouse",
            "start": 878.75,
            "end": 880.23
          },
          {
            "text": "for",
            "start": 880.31,
            "end": 881.8
          },
          {
            "text": "product",
            "start": 881.88,
            "end": 883.36
          },
          {
            "text": "analytics?",
            "start": 883.44,
            "end": 884.92
          }
        ]
      },
      {
        "id": "seg-1-034",
        "speakerId": "spk-2",
        "start": 887,
        "end": 913,
        "text": "CockroachDB has native CDC changefeeds that stream directly into Kafka with exactly-once semantics, eliminating our fragile Debezium connector layer.",
        "words": [
          {
            "text": "CockroachDB",
            "start": 887,
            "end": 888.3
          },
          {
            "text": "has",
            "start": 888.37,
            "end": 889.67
          },
          {
            "text": "native",
            "start": 889.74,
            "end": 891.04
          },
          {
            "text": "CDC",
            "start": 891.11,
            "end": 892.41
          },
          {
            "text": "changefeeds",
            "start": 892.47,
            "end": 893.77
          },
          {
            "text": "that",
            "start": 893.84,
            "end": 895.14
          },
          {
            "text": "stream",
            "start": 895.21,
            "end": 896.51
          },
          {
            "text": "directly",
            "start": 896.58,
            "end": 897.88
          },
          {
            "text": "into",
            "start": 897.95,
            "end": 899.25
          },
          {
            "text": "Kafka",
            "start": 899.32,
            "end": 900.62
          },
          {
            "text": "with",
            "start": 900.68,
            "end": 901.98
          },
          {
            "text": "exactly-once",
            "start": 902.05,
            "end": 903.35
          },
          {
            "text": "semantics,",
            "start": 903.42,
            "end": 904.72
          },
          {
            "text": "eliminating",
            "start": 904.79,
            "end": 906.09
          },
          {
            "text": "our",
            "start": 906.16,
            "end": 907.46
          },
          {
            "text": "fragile",
            "start": 907.53,
            "end": 908.83
          },
          {
            "text": "Debezium",
            "start": 908.89,
            "end": 910.19
          },
          {
            "text": "connector",
            "start": 910.26,
            "end": 911.56
          },
          {
            "text": "layer.",
            "start": 911.63,
            "end": 912.93
          }
        ]
      },
      {
        "id": "seg-1-035",
        "speakerId": "spk-5",
        "start": 915,
        "end": 940,
        "text": "From a verification standpoint, we must validate how schema migrations occur without taking locks. Zero-downtime DDL is mandatory for four-nines uptime.",
        "words": [
          {
            "text": "From",
            "start": 915,
            "end": 916.13
          },
          {
            "text": "a",
            "start": 916.19,
            "end": 917.32
          },
          {
            "text": "verification",
            "start": 917.38,
            "end": 918.51
          },
          {
            "text": "standpoint,",
            "start": 918.57,
            "end": 919.7
          },
          {
            "text": "we",
            "start": 919.76,
            "end": 920.89
          },
          {
            "text": "must",
            "start": 920.95,
            "end": 922.08
          },
          {
            "text": "validate",
            "start": 922.14,
            "end": 923.27
          },
          {
            "text": "how",
            "start": 923.33,
            "end": 924.46
          },
          {
            "text": "schema",
            "start": 924.52,
            "end": 925.65
          },
          {
            "text": "migrations",
            "start": 925.71,
            "end": 926.85
          },
          {
            "text": "occur",
            "start": 926.9,
            "end": 928.04
          },
          {
            "text": "without",
            "start": 928.1,
            "end": 929.23
          },
          {
            "text": "taking",
            "start": 929.29,
            "end": 930.42
          },
          {
            "text": "locks.",
            "start": 930.48,
            "end": 931.61
          },
          {
            "text": "Zero-downtime",
            "start": 931.67,
            "end": 932.8
          },
          {
            "text": "DDL",
            "start": 932.86,
            "end": 933.99
          },
          {
            "text": "is",
            "start": 934.05,
            "end": 935.18
          },
          {
            "text": "mandatory",
            "start": 935.24,
            "end": 936.37
          },
          {
            "text": "for",
            "start": 936.43,
            "end": 937.56
          },
          {
            "text": "four-nines",
            "start": 937.62,
            "end": 938.75
          },
          {
            "text": "uptime.",
            "start": 938.81,
            "end": 939.94
          }
        ]
      },
      {
        "id": "seg-1-036",
        "speakerId": "spk-2",
        "start": 943,
        "end": 969,
        "text": "CockroachDB executes online schema changes asynchronously using multi-version concurrency control, so no table locks are acquired during migrations.",
        "words": [
          {
            "text": "CockroachDB",
            "start": 943,
            "end": 944.37
          },
          {
            "text": "executes",
            "start": 944.44,
            "end": 945.82
          },
          {
            "text": "online",
            "start": 945.89,
            "end": 947.26
          },
          {
            "text": "schema",
            "start": 947.33,
            "end": 948.71
          },
          {
            "text": "changes",
            "start": 948.78,
            "end": 950.15
          },
          {
            "text": "asynchronously",
            "start": 950.22,
            "end": 951.59
          },
          {
            "text": "using",
            "start": 951.67,
            "end": 953.04
          },
          {
            "text": "multi-version",
            "start": 953.11,
            "end": 954.48
          },
          {
            "text": "concurrency",
            "start": 954.56,
            "end": 955.93
          },
          {
            "text": "control,",
            "start": 956,
            "end": 957.37
          },
          {
            "text": "so",
            "start": 957.44,
            "end": 958.82
          },
          {
            "text": "no",
            "start": 958.89,
            "end": 960.26
          },
          {
            "text": "table",
            "start": 960.33,
            "end": 961.71
          },
          {
            "text": "locks",
            "start": 961.78,
            "end": 963.15
          },
          {
            "text": "are",
            "start": 963.22,
            "end": 964.59
          },
          {
            "text": "acquired",
            "start": 964.67,
            "end": 966.04
          },
          {
            "text": "during",
            "start": 966.11,
            "end": 967.48
          },
          {
            "text": "migrations.",
            "start": 967.56,
            "end": 968.93
          }
        ]
      },
      {
        "id": "seg-1-037",
        "speakerId": "spk-3",
        "start": 971,
        "end": 995,
        "text": "This sounds like the right strategic direction for enterprise stability. Alex has the green light on the RFC.",
        "words": [
          {
            "text": "This",
            "start": 971,
            "end": 972.27
          },
          {
            "text": "sounds",
            "start": 972.33,
            "end": 973.6
          },
          {
            "text": "like",
            "start": 973.67,
            "end": 974.93
          },
          {
            "text": "the",
            "start": 975,
            "end": 976.27
          },
          {
            "text": "right",
            "start": 976.33,
            "end": 977.6
          },
          {
            "text": "strategic",
            "start": 977.67,
            "end": 978.93
          },
          {
            "text": "direction",
            "start": 979,
            "end": 980.27
          },
          {
            "text": "for",
            "start": 980.33,
            "end": 981.6
          },
          {
            "text": "enterprise",
            "start": 981.67,
            "end": 982.93
          },
          {
            "text": "stability.",
            "start": 983,
            "end": 984.27
          },
          {
            "text": "Alex",
            "start": 984.33,
            "end": 985.6
          },
          {
            "text": "has",
            "start": 985.67,
            "end": 986.93
          },
          {
            "text": "the",
            "start": 987,
            "end": 988.27
          },
          {
            "text": "green",
            "start": 988.33,
            "end": 989.6
          },
          {
            "text": "light",
            "start": 989.67,
            "end": 990.93
          },
          {
            "text": "on",
            "start": 991,
            "end": 992.27
          },
          {
            "text": "the",
            "start": 992.33,
            "end": 993.6
          },
          {
            "text": "RFC.",
            "start": 993.67,
            "end": 994.93
          }
        ]
      },
      {
        "id": "seg-1-038",
        "speakerId": "spk-8",
        "start": 997,
        "end": 1021,
        "text": "Make sure the RFC details data residency partitioning for European GDPR compliance so EU transcripts never leave the Frankfurt region.",
        "words": [
          {
            "text": "Make",
            "start": 997,
            "end": 998.14
          },
          {
            "text": "sure",
            "start": 998.2,
            "end": 999.34
          },
          {
            "text": "the",
            "start": 999.4,
            "end": 1000.54
          },
          {
            "text": "RFC",
            "start": 1000.6,
            "end": 1001.74
          },
          {
            "text": "details",
            "start": 1001.8,
            "end": 1002.94
          },
          {
            "text": "data",
            "start": 1003,
            "end": 1004.14
          },
          {
            "text": "residency",
            "start": 1004.2,
            "end": 1005.34
          },
          {
            "text": "partitioning",
            "start": 1005.4,
            "end": 1006.54
          },
          {
            "text": "for",
            "start": 1006.6,
            "end": 1007.74
          },
          {
            "text": "European",
            "start": 1007.8,
            "end": 1008.94
          },
          {
            "text": "GDPR",
            "start": 1009,
            "end": 1010.14
          },
          {
            "text": "compliance",
            "start": 1010.2,
            "end": 1011.34
          },
          {
            "text": "so",
            "start": 1011.4,
            "end": 1012.54
          },
          {
            "text": "EU",
            "start": 1012.6,
            "end": 1013.74
          },
          {
            "text": "transcripts",
            "start": 1013.8,
            "end": 1014.94
          },
          {
            "text": "never",
            "start": 1015,
            "end": 1016.14
          },
          {
            "text": "leave",
            "start": 1016.2,
            "end": 1017.34
          },
          {
            "text": "the",
            "start": 1017.4,
            "end": 1018.54
          },
          {
            "text": "Frankfurt",
            "start": 1018.6,
            "end": 1019.74
          },
          {
            "text": "region.",
            "start": 1019.8,
            "end": 1020.94
          }
        ]
      },
      {
        "id": "seg-1-039",
        "speakerId": "spk-4",
        "start": 1024,
        "end": 1051,
        "text": "Let's turn to service mesh and traffic routing. Marcus here. Currently, we are running traditional Istio sidecars injected alongside every microservice container.",
        "words": [
          {
            "text": "Let's",
            "start": 1024,
            "end": 1025.17
          },
          {
            "text": "turn",
            "start": 1025.23,
            "end": 1026.39
          },
          {
            "text": "to",
            "start": 1026.45,
            "end": 1027.62
          },
          {
            "text": "service",
            "start": 1027.68,
            "end": 1028.85
          },
          {
            "text": "mesh",
            "start": 1028.91,
            "end": 1030.08
          },
          {
            "text": "and",
            "start": 1030.14,
            "end": 1031.3
          },
          {
            "text": "traffic",
            "start": 1031.36,
            "end": 1032.53
          },
          {
            "text": "routing.",
            "start": 1032.59,
            "end": 1033.76
          },
          {
            "text": "Marcus",
            "start": 1033.82,
            "end": 1034.98
          },
          {
            "text": "here.",
            "start": 1035.05,
            "end": 1036.21
          },
          {
            "text": "Currently,",
            "start": 1036.27,
            "end": 1037.44
          },
          {
            "text": "we",
            "start": 1037.5,
            "end": 1038.67
          },
          {
            "text": "are",
            "start": 1038.73,
            "end": 1039.89
          },
          {
            "text": "running",
            "start": 1039.95,
            "end": 1041.12
          },
          {
            "text": "traditional",
            "start": 1041.18,
            "end": 1042.35
          },
          {
            "text": "Istio",
            "start": 1042.41,
            "end": 1043.58
          },
          {
            "text": "sidecars",
            "start": 1043.64,
            "end": 1044.8
          },
          {
            "text": "injected",
            "start": 1044.86,
            "end": 1046.03
          },
          {
            "text": "alongside",
            "start": 1046.09,
            "end": 1047.26
          },
          {
            "text": "every",
            "start": 1047.32,
            "end": 1048.48
          },
          {
            "text": "microservice",
            "start": 1048.55,
            "end": 1049.71
          },
          {
            "text": "container.",
            "start": 1049.77,
            "end": 1050.94
          }
        ]
      },
      {
        "id": "seg-1-040",
        "speakerId": "spk-4",
        "start": 1052,
        "end": 1079,
        "text": "Those Envoy sidecars add roughly twelve megabytes of memory per pod and introduce point-eight milliseconds of synthetic latency on every internal gRPC call.",
        "words": [
          {
            "text": "Those",
            "start": 1052,
            "end": 1053.12
          },
          {
            "text": "Envoy",
            "start": 1053.17,
            "end": 1054.29
          },
          {
            "text": "sidecars",
            "start": 1054.35,
            "end": 1055.46
          },
          {
            "text": "add",
            "start": 1055.52,
            "end": 1056.64
          },
          {
            "text": "roughly",
            "start": 1056.7,
            "end": 1057.81
          },
          {
            "text": "twelve",
            "start": 1057.87,
            "end": 1058.98
          },
          {
            "text": "megabytes",
            "start": 1059.04,
            "end": 1060.16
          },
          {
            "text": "of",
            "start": 1060.22,
            "end": 1061.33
          },
          {
            "text": "memory",
            "start": 1061.39,
            "end": 1062.51
          },
          {
            "text": "per",
            "start": 1062.57,
            "end": 1063.68
          },
          {
            "text": "pod",
            "start": 1063.74,
            "end": 1064.85
          },
          {
            "text": "and",
            "start": 1064.91,
            "end": 1066.03
          },
          {
            "text": "introduce",
            "start": 1066.09,
            "end": 1067.2
          },
          {
            "text": "point-eight",
            "start": 1067.26,
            "end": 1068.38
          },
          {
            "text": "milliseconds",
            "start": 1068.43,
            "end": 1069.55
          },
          {
            "text": "of",
            "start": 1069.61,
            "end": 1070.72
          },
          {
            "text": "synthetic",
            "start": 1070.78,
            "end": 1071.9
          },
          {
            "text": "latency",
            "start": 1071.96,
            "end": 1073.07
          },
          {
            "text": "on",
            "start": 1073.13,
            "end": 1074.25
          },
          {
            "text": "every",
            "start": 1074.3,
            "end": 1075.42
          },
          {
            "text": "internal",
            "start": 1075.48,
            "end": 1076.59
          },
          {
            "text": "gRPC",
            "start": 1076.65,
            "end": 1077.77
          },
          {
            "text": "call.",
            "start": 1077.83,
            "end": 1078.94
          }
        ]
      },
      {
        "id": "seg-1-041",
        "speakerId": "spk-7",
        "start": 1082,
        "end": 1108,
        "text": "On frontend API routes that aggregate five downstream microservices, those point-eight milliseconds accumulate to four milliseconds of pure network proxy overhead.",
        "words": [
          {
            "text": "On",
            "start": 1082,
            "end": 1083.18
          },
          {
            "text": "frontend",
            "start": 1083.24,
            "end": 1084.41
          },
          {
            "text": "API",
            "start": 1084.48,
            "end": 1085.65
          },
          {
            "text": "routes",
            "start": 1085.71,
            "end": 1086.89
          },
          {
            "text": "that",
            "start": 1086.95,
            "end": 1088.13
          },
          {
            "text": "aggregate",
            "start": 1088.19,
            "end": 1089.37
          },
          {
            "text": "five",
            "start": 1089.43,
            "end": 1090.6
          },
          {
            "text": "downstream",
            "start": 1090.67,
            "end": 1091.84
          },
          {
            "text": "microservices,",
            "start": 1091.9,
            "end": 1093.08
          },
          {
            "text": "those",
            "start": 1093.14,
            "end": 1094.32
          },
          {
            "text": "point-eight",
            "start": 1094.38,
            "end": 1095.56
          },
          {
            "text": "milliseconds",
            "start": 1095.62,
            "end": 1096.8
          },
          {
            "text": "accumulate",
            "start": 1096.86,
            "end": 1098.03
          },
          {
            "text": "to",
            "start": 1098.1,
            "end": 1099.27
          },
          {
            "text": "four",
            "start": 1099.33,
            "end": 1100.51
          },
          {
            "text": "milliseconds",
            "start": 1100.57,
            "end": 1101.75
          },
          {
            "text": "of",
            "start": 1101.81,
            "end": 1102.99
          },
          {
            "text": "pure",
            "start": 1103.05,
            "end": 1104.22
          },
          {
            "text": "network",
            "start": 1104.29,
            "end": 1105.46
          },
          {
            "text": "proxy",
            "start": 1105.52,
            "end": 1106.7
          },
          {
            "text": "overhead.",
            "start": 1106.76,
            "end": 1107.94
          }
        ]
      },
      {
        "id": "seg-1-042",
        "speakerId": "spk-4",
        "start": 1110,
        "end": 1138,
        "text": "Exactly Maya. That is why we are proposing a migration to Istio Ambient Mesh, which eliminates sidecars in favor of node-level ztunnel proxies using eBPF.",
        "words": [
          {
            "text": "Exactly",
            "start": 1110,
            "end": 1111.06
          },
          {
            "text": "Maya.",
            "start": 1111.12,
            "end": 1112.18
          },
          {
            "text": "That",
            "start": 1112.24,
            "end": 1113.3
          },
          {
            "text": "is",
            "start": 1113.36,
            "end": 1114.42
          },
          {
            "text": "why",
            "start": 1114.48,
            "end": 1115.54
          },
          {
            "text": "we",
            "start": 1115.6,
            "end": 1116.66
          },
          {
            "text": "are",
            "start": 1116.72,
            "end": 1117.78
          },
          {
            "text": "proposing",
            "start": 1117.84,
            "end": 1118.9
          },
          {
            "text": "a",
            "start": 1118.96,
            "end": 1120.02
          },
          {
            "text": "migration",
            "start": 1120.08,
            "end": 1121.14
          },
          {
            "text": "to",
            "start": 1121.2,
            "end": 1122.26
          },
          {
            "text": "Istio",
            "start": 1122.32,
            "end": 1123.38
          },
          {
            "text": "Ambient",
            "start": 1123.44,
            "end": 1124.5
          },
          {
            "text": "Mesh,",
            "start": 1124.56,
            "end": 1125.62
          },
          {
            "text": "which",
            "start": 1125.68,
            "end": 1126.74
          },
          {
            "text": "eliminates",
            "start": 1126.8,
            "end": 1127.86
          },
          {
            "text": "sidecars",
            "start": 1127.92,
            "end": 1128.98
          },
          {
            "text": "in",
            "start": 1129.04,
            "end": 1130.1
          },
          {
            "text": "favor",
            "start": 1130.16,
            "end": 1131.22
          },
          {
            "text": "of",
            "start": 1131.28,
            "end": 1132.34
          },
          {
            "text": "node-level",
            "start": 1132.4,
            "end": 1133.46
          },
          {
            "text": "ztunnel",
            "start": 1133.52,
            "end": 1134.58
          },
          {
            "text": "proxies",
            "start": 1134.64,
            "end": 1135.7
          },
          {
            "text": "using",
            "start": 1135.76,
            "end": 1136.82
          },
          {
            "text": "eBPF.",
            "start": 1136.88,
            "end": 1137.94
          }
        ]
      },
      {
        "id": "seg-1-043",
        "speakerId": "spk-8",
        "start": 1140,
        "end": 1166,
        "text": "From a security perspective, does Ambient Mesh still enforce zero-trust mTLS and cryptographic workload identities via SPIFFE?",
        "words": [
          {
            "text": "From",
            "start": 1140,
            "end": 1141.45
          },
          {
            "text": "a",
            "start": 1141.53,
            "end": 1142.98
          },
          {
            "text": "security",
            "start": 1143.06,
            "end": 1144.51
          },
          {
            "text": "perspective,",
            "start": 1144.59,
            "end": 1146.04
          },
          {
            "text": "does",
            "start": 1146.12,
            "end": 1147.57
          },
          {
            "text": "Ambient",
            "start": 1147.65,
            "end": 1149.1
          },
          {
            "text": "Mesh",
            "start": 1149.18,
            "end": 1150.63
          },
          {
            "text": "still",
            "start": 1150.71,
            "end": 1152.16
          },
          {
            "text": "enforce",
            "start": 1152.24,
            "end": 1153.69
          },
          {
            "text": "zero-trust",
            "start": 1153.76,
            "end": 1155.22
          },
          {
            "text": "mTLS",
            "start": 1155.29,
            "end": 1156.75
          },
          {
            "text": "and",
            "start": 1156.82,
            "end": 1158.28
          },
          {
            "text": "cryptographic",
            "start": 1158.35,
            "end": 1159.81
          },
          {
            "text": "workload",
            "start": 1159.88,
            "end": 1161.34
          },
          {
            "text": "identities",
            "start": 1161.41,
            "end": 1162.86
          },
          {
            "text": "via",
            "start": 1162.94,
            "end": 1164.39
          },
          {
            "text": "SPIFFE?",
            "start": 1164.47,
            "end": 1165.92
          }
        ]
      },
      {
        "id": "seg-1-044",
        "speakerId": "spk-4",
        "start": 1167,
        "end": 1195,
        "text": "Yes James, Ambient Mesh enforces L4 mTLS through the ztunnel at the kernel level with cryptographic SPIFFE identities, achieving sixty percent lower CPU overhead.",
        "words": [
          {
            "text": "Yes",
            "start": 1167,
            "end": 1168.11
          },
          {
            "text": "James,",
            "start": 1168.17,
            "end": 1169.28
          },
          {
            "text": "Ambient",
            "start": 1169.33,
            "end": 1170.44
          },
          {
            "text": "Mesh",
            "start": 1170.5,
            "end": 1171.61
          },
          {
            "text": "enforces",
            "start": 1171.67,
            "end": 1172.78
          },
          {
            "text": "L4",
            "start": 1172.83,
            "end": 1173.94
          },
          {
            "text": "mTLS",
            "start": 1174,
            "end": 1175.11
          },
          {
            "text": "through",
            "start": 1175.17,
            "end": 1176.28
          },
          {
            "text": "the",
            "start": 1176.33,
            "end": 1177.44
          },
          {
            "text": "ztunnel",
            "start": 1177.5,
            "end": 1178.61
          },
          {
            "text": "at",
            "start": 1178.67,
            "end": 1179.78
          },
          {
            "text": "the",
            "start": 1179.83,
            "end": 1180.94
          },
          {
            "text": "kernel",
            "start": 1181,
            "end": 1182.11
          },
          {
            "text": "level",
            "start": 1182.17,
            "end": 1183.28
          },
          {
            "text": "with",
            "start": 1183.33,
            "end": 1184.44
          },
          {
            "text": "cryptographic",
            "start": 1184.5,
            "end": 1185.61
          },
          {
            "text": "SPIFFE",
            "start": 1185.67,
            "end": 1186.78
          },
          {
            "text": "identities,",
            "start": 1186.83,
            "end": 1187.94
          },
          {
            "text": "achieving",
            "start": 1188,
            "end": 1189.11
          },
          {
            "text": "sixty",
            "start": 1189.17,
            "end": 1190.28
          },
          {
            "text": "percent",
            "start": 1190.33,
            "end": 1191.44
          },
          {
            "text": "lower",
            "start": 1191.5,
            "end": 1192.61
          },
          {
            "text": "CPU",
            "start": 1192.67,
            "end": 1193.78
          },
          {
            "text": "overhead.",
            "start": 1193.83,
            "end": 1194.94
          }
        ]
      },
      {
        "id": "seg-1-045",
        "speakerId": "spk-5",
        "start": 1197,
        "end": 1223,
        "text": "How do we handle progressive canary deployments without sidecar route rules? Can we still execute weighted canary traffic splitting?",
        "words": [
          {
            "text": "How",
            "start": 1197,
            "end": 1198.3
          },
          {
            "text": "do",
            "start": 1198.37,
            "end": 1199.67
          },
          {
            "text": "we",
            "start": 1199.74,
            "end": 1201.04
          },
          {
            "text": "handle",
            "start": 1201.11,
            "end": 1202.41
          },
          {
            "text": "progressive",
            "start": 1202.47,
            "end": 1203.77
          },
          {
            "text": "canary",
            "start": 1203.84,
            "end": 1205.14
          },
          {
            "text": "deployments",
            "start": 1205.21,
            "end": 1206.51
          },
          {
            "text": "without",
            "start": 1206.58,
            "end": 1207.88
          },
          {
            "text": "sidecar",
            "start": 1207.95,
            "end": 1209.25
          },
          {
            "text": "route",
            "start": 1209.32,
            "end": 1210.62
          },
          {
            "text": "rules?",
            "start": 1210.68,
            "end": 1211.98
          },
          {
            "text": "Can",
            "start": 1212.05,
            "end": 1213.35
          },
          {
            "text": "we",
            "start": 1213.42,
            "end": 1214.72
          },
          {
            "text": "still",
            "start": 1214.79,
            "end": 1216.09
          },
          {
            "text": "execute",
            "start": 1216.16,
            "end": 1217.46
          },
          {
            "text": "weighted",
            "start": 1217.53,
            "end": 1218.83
          },
          {
            "text": "canary",
            "start": 1218.89,
            "end": 1220.19
          },
          {
            "text": "traffic",
            "start": 1220.26,
            "end": 1221.56
          },
          {
            "text": "splitting?",
            "start": 1221.63,
            "end": 1222.93
          }
        ]
      },
      {
        "id": "seg-1-046",
        "speakerId": "spk-4",
        "start": 1225,
        "end": 1253,
        "text": "We can use Argo Rollouts paired with Istio Waypoint proxies. Waypoint proxies handle L7 routing and allow us to do progressive canaries: two percent, ten percent, fifty percent, then full rollout.",
        "words": [
          {
            "text": "We",
            "start": 1225,
            "end": 1225.86
          },
          {
            "text": "can",
            "start": 1225.9,
            "end": 1226.76
          },
          {
            "text": "use",
            "start": 1226.81,
            "end": 1227.66
          },
          {
            "text": "Argo",
            "start": 1227.71,
            "end": 1228.57
          },
          {
            "text": "Rollouts",
            "start": 1228.61,
            "end": 1229.47
          },
          {
            "text": "paired",
            "start": 1229.52,
            "end": 1230.37
          },
          {
            "text": "with",
            "start": 1230.42,
            "end": 1231.28
          },
          {
            "text": "Istio",
            "start": 1231.32,
            "end": 1232.18
          },
          {
            "text": "Waypoint",
            "start": 1232.23,
            "end": 1233.08
          },
          {
            "text": "proxies.",
            "start": 1233.13,
            "end": 1233.99
          },
          {
            "text": "Waypoint",
            "start": 1234.03,
            "end": 1234.89
          },
          {
            "text": "proxies",
            "start": 1234.94,
            "end": 1235.79
          },
          {
            "text": "handle",
            "start": 1235.84,
            "end": 1236.7
          },
          {
            "text": "L7",
            "start": 1236.74,
            "end": 1237.6
          },
          {
            "text": "routing",
            "start": 1237.65,
            "end": 1238.5
          },
          {
            "text": "and",
            "start": 1238.55,
            "end": 1239.41
          },
          {
            "text": "allow",
            "start": 1239.45,
            "end": 1240.31
          },
          {
            "text": "us",
            "start": 1240.35,
            "end": 1241.21
          },
          {
            "text": "to",
            "start": 1241.26,
            "end": 1242.12
          },
          {
            "text": "do",
            "start": 1242.16,
            "end": 1243.02
          },
          {
            "text": "progressive",
            "start": 1243.06,
            "end": 1243.92
          },
          {
            "text": "canaries:",
            "start": 1243.97,
            "end": 1244.83
          },
          {
            "text": "two",
            "start": 1244.87,
            "end": 1245.73
          },
          {
            "text": "percent,",
            "start": 1245.77,
            "end": 1246.63
          },
          {
            "text": "ten",
            "start": 1246.68,
            "end": 1247.54
          },
          {
            "text": "percent,",
            "start": 1247.58,
            "end": 1248.44
          },
          {
            "text": "fifty",
            "start": 1248.48,
            "end": 1249.34
          },
          {
            "text": "percent,",
            "start": 1249.39,
            "end": 1250.25
          },
          {
            "text": "then",
            "start": 1250.29,
            "end": 1251.15
          },
          {
            "text": "full",
            "start": 1251.19,
            "end": 1252.05
          },
          {
            "text": "rollout.",
            "start": 1252.1,
            "end": 1252.95
          }
        ]
      },
      {
        "id": "seg-1-047",
        "speakerId": "spk-7",
        "start": 1255,
        "end": 1280,
        "text": "Does ztunnel support transparent HTTP/2 multiplexing for our streaming transcription endpoints?",
        "words": [
          {
            "text": "Does",
            "start": 1255,
            "end": 1257.16
          },
          {
            "text": "ztunnel",
            "start": 1257.27,
            "end": 1259.43
          },
          {
            "text": "support",
            "start": 1259.55,
            "end": 1261.7
          },
          {
            "text": "transparent",
            "start": 1261.82,
            "end": 1263.98
          },
          {
            "text": "HTTP/2",
            "start": 1264.09,
            "end": 1266.25
          },
          {
            "text": "multiplexing",
            "start": 1266.36,
            "end": 1268.52
          },
          {
            "text": "for",
            "start": 1268.64,
            "end": 1270.8
          },
          {
            "text": "our",
            "start": 1270.91,
            "end": 1273.07
          },
          {
            "text": "streaming",
            "start": 1273.18,
            "end": 1275.34
          },
          {
            "text": "transcription",
            "start": 1275.45,
            "end": 1277.61
          },
          {
            "text": "endpoints?",
            "start": 1277.73,
            "end": 1279.89
          }
        ]
      },
      {
        "id": "seg-1-048",
        "speakerId": "spk-4",
        "start": 1283,
        "end": 1308,
        "text": "Yes, ztunnel multiplexes multiple TCP connections over persistent HBONE mTLS tunnels, which significantly lowers TLS handshake overhead.",
        "words": [
          {
            "text": "Yes,",
            "start": 1283,
            "end": 1284.4
          },
          {
            "text": "ztunnel",
            "start": 1284.47,
            "end": 1285.87
          },
          {
            "text": "multiplexes",
            "start": 1285.94,
            "end": 1287.34
          },
          {
            "text": "multiple",
            "start": 1287.41,
            "end": 1288.81
          },
          {
            "text": "TCP",
            "start": 1288.88,
            "end": 1290.28
          },
          {
            "text": "connections",
            "start": 1290.35,
            "end": 1291.75
          },
          {
            "text": "over",
            "start": 1291.82,
            "end": 1293.22
          },
          {
            "text": "persistent",
            "start": 1293.29,
            "end": 1294.69
          },
          {
            "text": "HBONE",
            "start": 1294.76,
            "end": 1296.16
          },
          {
            "text": "mTLS",
            "start": 1296.24,
            "end": 1297.63
          },
          {
            "text": "tunnels,",
            "start": 1297.71,
            "end": 1299.1
          },
          {
            "text": "which",
            "start": 1299.18,
            "end": 1300.57
          },
          {
            "text": "significantly",
            "start": 1300.65,
            "end": 1302.04
          },
          {
            "text": "lowers",
            "start": 1302.12,
            "end": 1303.51
          },
          {
            "text": "TLS",
            "start": 1303.59,
            "end": 1304.99
          },
          {
            "text": "handshake",
            "start": 1305.06,
            "end": 1306.46
          },
          {
            "text": "overhead.",
            "start": 1306.53,
            "end": 1307.93
          }
        ]
      },
      {
        "id": "seg-1-049",
        "speakerId": "spk-3",
        "start": 1311,
        "end": 1336,
        "text": "Marcus, what is the implementation plan for staging? When can we see the first live canary pipeline running in our test cluster?",
        "words": [
          {
            "text": "Marcus,",
            "start": 1311,
            "end": 1312.08
          },
          {
            "text": "what",
            "start": 1312.14,
            "end": 1313.22
          },
          {
            "text": "is",
            "start": 1313.27,
            "end": 1314.35
          },
          {
            "text": "the",
            "start": 1314.41,
            "end": 1315.49
          },
          {
            "text": "implementation",
            "start": 1315.55,
            "end": 1316.63
          },
          {
            "text": "plan",
            "start": 1316.68,
            "end": 1317.76
          },
          {
            "text": "for",
            "start": 1317.82,
            "end": 1318.9
          },
          {
            "text": "staging?",
            "start": 1318.95,
            "end": 1320.03
          },
          {
            "text": "When",
            "start": 1320.09,
            "end": 1321.17
          },
          {
            "text": "can",
            "start": 1321.23,
            "end": 1322.31
          },
          {
            "text": "we",
            "start": 1322.36,
            "end": 1323.44
          },
          {
            "text": "see",
            "start": 1323.5,
            "end": 1324.58
          },
          {
            "text": "the",
            "start": 1324.64,
            "end": 1325.72
          },
          {
            "text": "first",
            "start": 1325.77,
            "end": 1326.85
          },
          {
            "text": "live",
            "start": 1326.91,
            "end": 1327.99
          },
          {
            "text": "canary",
            "start": 1328.05,
            "end": 1329.13
          },
          {
            "text": "pipeline",
            "start": 1329.18,
            "end": 1330.26
          },
          {
            "text": "running",
            "start": 1330.32,
            "end": 1331.4
          },
          {
            "text": "in",
            "start": 1331.45,
            "end": 1332.53
          },
          {
            "text": "our",
            "start": 1332.59,
            "end": 1333.67
          },
          {
            "text": "test",
            "start": 1333.73,
            "end": 1334.81
          },
          {
            "text": "cluster?",
            "start": 1334.86,
            "end": 1335.94
          }
        ]
      },
      {
        "id": "seg-1-050",
        "speakerId": "spk-4",
        "start": 1339,
        "end": 1366,
        "text": "I will implement the Istio Ambient Mesh canary deployment pipeline in staging by September twenty-fifth and run synthetic canary rollouts with Elena.",
        "words": [
          {
            "text": "I",
            "start": 1339,
            "end": 1340.17
          },
          {
            "text": "will",
            "start": 1340.23,
            "end": 1341.39
          },
          {
            "text": "implement",
            "start": 1341.45,
            "end": 1342.62
          },
          {
            "text": "the",
            "start": 1342.68,
            "end": 1343.85
          },
          {
            "text": "Istio",
            "start": 1343.91,
            "end": 1345.08
          },
          {
            "text": "Ambient",
            "start": 1345.14,
            "end": 1346.3
          },
          {
            "text": "Mesh",
            "start": 1346.36,
            "end": 1347.53
          },
          {
            "text": "canary",
            "start": 1347.59,
            "end": 1348.76
          },
          {
            "text": "deployment",
            "start": 1348.82,
            "end": 1349.98
          },
          {
            "text": "pipeline",
            "start": 1350.05,
            "end": 1351.21
          },
          {
            "text": "in",
            "start": 1351.27,
            "end": 1352.44
          },
          {
            "text": "staging",
            "start": 1352.5,
            "end": 1353.67
          },
          {
            "text": "by",
            "start": 1353.73,
            "end": 1354.89
          },
          {
            "text": "September",
            "start": 1354.95,
            "end": 1356.12
          },
          {
            "text": "twenty-fifth",
            "start": 1356.18,
            "end": 1357.35
          },
          {
            "text": "and",
            "start": 1357.41,
            "end": 1358.58
          },
          {
            "text": "run",
            "start": 1358.64,
            "end": 1359.8
          },
          {
            "text": "synthetic",
            "start": 1359.86,
            "end": 1361.03
          },
          {
            "text": "canary",
            "start": 1361.09,
            "end": 1362.26
          },
          {
            "text": "rollouts",
            "start": 1362.32,
            "end": 1363.48
          },
          {
            "text": "with",
            "start": 1363.55,
            "end": 1364.71
          },
          {
            "text": "Elena.",
            "start": 1364.77,
            "end": 1365.94
          }
        ]
      },
      {
        "id": "seg-1-051",
        "speakerId": "spk-5",
        "start": 1369,
        "end": 1395,
        "text": "That brings us naturally to chaos engineering and resilience testing. Elena here. Over the last sprint, we ran simulated AWS availability zone outages.",
        "words": [
          {
            "text": "That",
            "start": 1369,
            "end": 1370.07
          },
          {
            "text": "brings",
            "start": 1370.13,
            "end": 1371.2
          },
          {
            "text": "us",
            "start": 1371.26,
            "end": 1372.33
          },
          {
            "text": "naturally",
            "start": 1372.39,
            "end": 1373.47
          },
          {
            "text": "to",
            "start": 1373.52,
            "end": 1374.6
          },
          {
            "text": "chaos",
            "start": 1374.65,
            "end": 1375.73
          },
          {
            "text": "engineering",
            "start": 1375.78,
            "end": 1376.86
          },
          {
            "text": "and",
            "start": 1376.91,
            "end": 1377.99
          },
          {
            "text": "resilience",
            "start": 1378.04,
            "end": 1379.12
          },
          {
            "text": "testing.",
            "start": 1379.17,
            "end": 1380.25
          },
          {
            "text": "Elena",
            "start": 1380.3,
            "end": 1381.38
          },
          {
            "text": "here.",
            "start": 1381.43,
            "end": 1382.51
          },
          {
            "text": "Over",
            "start": 1382.57,
            "end": 1383.64
          },
          {
            "text": "the",
            "start": 1383.7,
            "end": 1384.77
          },
          {
            "text": "last",
            "start": 1384.83,
            "end": 1385.9
          },
          {
            "text": "sprint,",
            "start": 1385.96,
            "end": 1387.03
          },
          {
            "text": "we",
            "start": 1387.09,
            "end": 1388.16
          },
          {
            "text": "ran",
            "start": 1388.22,
            "end": 1389.29
          },
          {
            "text": "simulated",
            "start": 1389.35,
            "end": 1390.42
          },
          {
            "text": "AWS",
            "start": 1390.48,
            "end": 1391.55
          },
          {
            "text": "availability",
            "start": 1391.61,
            "end": 1392.68
          },
          {
            "text": "zone",
            "start": 1392.74,
            "end": 1393.81
          },
          {
            "text": "outages.",
            "start": 1393.87,
            "end": 1394.94
          }
        ]
      },
      {
        "id": "seg-1-052",
        "speakerId": "spk-5",
        "start": 1397,
        "end": 1425,
        "text": "While our stateless API pods recovered quickly, our stateful ingestion workers experienced thirty to forty-five seconds of split-brain confusion during network partitions.",
        "words": [
          {
            "text": "While",
            "start": 1397,
            "end": 1398.21
          },
          {
            "text": "our",
            "start": 1398.27,
            "end": 1399.48
          },
          {
            "text": "stateless",
            "start": 1399.55,
            "end": 1400.75
          },
          {
            "text": "API",
            "start": 1400.82,
            "end": 1402.03
          },
          {
            "text": "pods",
            "start": 1402.09,
            "end": 1403.3
          },
          {
            "text": "recovered",
            "start": 1403.36,
            "end": 1404.57
          },
          {
            "text": "quickly,",
            "start": 1404.64,
            "end": 1405.85
          },
          {
            "text": "our",
            "start": 1405.91,
            "end": 1407.12
          },
          {
            "text": "stateful",
            "start": 1407.18,
            "end": 1408.39
          },
          {
            "text": "ingestion",
            "start": 1408.45,
            "end": 1409.66
          },
          {
            "text": "workers",
            "start": 1409.73,
            "end": 1410.94
          },
          {
            "text": "experienced",
            "start": 1411,
            "end": 1412.21
          },
          {
            "text": "thirty",
            "start": 1412.27,
            "end": 1413.48
          },
          {
            "text": "to",
            "start": 1413.55,
            "end": 1414.75
          },
          {
            "text": "forty-five",
            "start": 1414.82,
            "end": 1416.03
          },
          {
            "text": "seconds",
            "start": 1416.09,
            "end": 1417.3
          },
          {
            "text": "of",
            "start": 1417.36,
            "end": 1418.57
          },
          {
            "text": "split-brain",
            "start": 1418.64,
            "end": 1419.85
          },
          {
            "text": "confusion",
            "start": 1419.91,
            "end": 1421.12
          },
          {
            "text": "during",
            "start": 1421.18,
            "end": 1422.39
          },
          {
            "text": "network",
            "start": 1422.45,
            "end": 1423.66
          },
          {
            "text": "partitions.",
            "start": 1423.73,
            "end": 1424.94
          }
        ]
      },
      {
        "id": "seg-1-053",
        "speakerId": "spk-6",
        "start": 1427,
        "end": 1453,
        "text": "That was due to the Zookeeper quorum timeout being set too high on the legacy cluster before we migrated to KRaft mode.",
        "words": [
          {
            "text": "That",
            "start": 1427,
            "end": 1428.12
          },
          {
            "text": "was",
            "start": 1428.18,
            "end": 1429.3
          },
          {
            "text": "due",
            "start": 1429.36,
            "end": 1430.49
          },
          {
            "text": "to",
            "start": 1430.55,
            "end": 1431.67
          },
          {
            "text": "the",
            "start": 1431.73,
            "end": 1432.85
          },
          {
            "text": "Zookeeper",
            "start": 1432.91,
            "end": 1434.03
          },
          {
            "text": "quorum",
            "start": 1434.09,
            "end": 1435.21
          },
          {
            "text": "timeout",
            "start": 1435.27,
            "end": 1436.4
          },
          {
            "text": "being",
            "start": 1436.45,
            "end": 1437.58
          },
          {
            "text": "set",
            "start": 1437.64,
            "end": 1438.76
          },
          {
            "text": "too",
            "start": 1438.82,
            "end": 1439.94
          },
          {
            "text": "high",
            "start": 1440,
            "end": 1441.12
          },
          {
            "text": "on",
            "start": 1441.18,
            "end": 1442.3
          },
          {
            "text": "the",
            "start": 1442.36,
            "end": 1443.49
          },
          {
            "text": "legacy",
            "start": 1443.55,
            "end": 1444.67
          },
          {
            "text": "cluster",
            "start": 1444.73,
            "end": 1445.85
          },
          {
            "text": "before",
            "start": 1445.91,
            "end": 1447.03
          },
          {
            "text": "we",
            "start": 1447.09,
            "end": 1448.21
          },
          {
            "text": "migrated",
            "start": 1448.27,
            "end": 1449.4
          },
          {
            "text": "to",
            "start": 1449.45,
            "end": 1450.58
          },
          {
            "text": "KRaft",
            "start": 1450.64,
            "end": 1451.76
          },
          {
            "text": "mode.",
            "start": 1451.82,
            "end": 1452.94
          }
        ]
      },
      {
        "id": "seg-1-054",
        "speakerId": "spk-2",
        "start": 1455,
        "end": 1481,
        "text": "A forty-five-second recovery window violates our high-availability SLA. In production, that would cause customer meeting transcriptions to buffer and lag behind the audio stream.",
        "words": [
          {
            "text": "A",
            "start": 1455,
            "end": 1456.03
          },
          {
            "text": "forty-five-second",
            "start": 1456.08,
            "end": 1457.11
          },
          {
            "text": "recovery",
            "start": 1457.17,
            "end": 1458.2
          },
          {
            "text": "window",
            "start": 1458.25,
            "end": 1459.28
          },
          {
            "text": "violates",
            "start": 1459.33,
            "end": 1460.36
          },
          {
            "text": "our",
            "start": 1460.42,
            "end": 1461.45
          },
          {
            "text": "high-availability",
            "start": 1461.5,
            "end": 1462.53
          },
          {
            "text": "SLA.",
            "start": 1462.58,
            "end": 1463.61
          },
          {
            "text": "In",
            "start": 1463.67,
            "end": 1464.7
          },
          {
            "text": "production,",
            "start": 1464.75,
            "end": 1465.78
          },
          {
            "text": "that",
            "start": 1465.83,
            "end": 1466.86
          },
          {
            "text": "would",
            "start": 1466.92,
            "end": 1467.95
          },
          {
            "text": "cause",
            "start": 1468,
            "end": 1469.03
          },
          {
            "text": "customer",
            "start": 1469.08,
            "end": 1470.11
          },
          {
            "text": "meeting",
            "start": 1470.17,
            "end": 1471.2
          },
          {
            "text": "transcriptions",
            "start": 1471.25,
            "end": 1472.28
          },
          {
            "text": "to",
            "start": 1472.33,
            "end": 1473.36
          },
          {
            "text": "buffer",
            "start": 1473.42,
            "end": 1474.45
          },
          {
            "text": "and",
            "start": 1474.5,
            "end": 1475.53
          },
          {
            "text": "lag",
            "start": 1475.58,
            "end": 1476.61
          },
          {
            "text": "behind",
            "start": 1476.67,
            "end": 1477.7
          },
          {
            "text": "the",
            "start": 1477.75,
            "end": 1478.78
          },
          {
            "text": "audio",
            "start": 1478.83,
            "end": 1479.86
          },
          {
            "text": "stream.",
            "start": 1479.92,
            "end": 1480.95
          }
        ]
      },
      {
        "id": "seg-1-055",
        "speakerId": "spk-5",
        "start": 1482,
        "end": 1510,
        "text": "To catch these failures before they hit production, I want to create an automated chaos engineering test suite using Chaos Mesh directly in our staging environment.",
        "words": [
          {
            "text": "To",
            "start": 1482,
            "end": 1483.02
          },
          {
            "text": "catch",
            "start": 1483.08,
            "end": 1484.1
          },
          {
            "text": "these",
            "start": 1484.15,
            "end": 1485.18
          },
          {
            "text": "failures",
            "start": 1485.23,
            "end": 1486.25
          },
          {
            "text": "before",
            "start": 1486.31,
            "end": 1487.33
          },
          {
            "text": "they",
            "start": 1487.38,
            "end": 1488.41
          },
          {
            "text": "hit",
            "start": 1488.46,
            "end": 1489.48
          },
          {
            "text": "production,",
            "start": 1489.54,
            "end": 1490.56
          },
          {
            "text": "I",
            "start": 1490.62,
            "end": 1491.64
          },
          {
            "text": "want",
            "start": 1491.69,
            "end": 1492.72
          },
          {
            "text": "to",
            "start": 1492.77,
            "end": 1493.79
          },
          {
            "text": "create",
            "start": 1493.85,
            "end": 1494.87
          },
          {
            "text": "an",
            "start": 1494.92,
            "end": 1495.95
          },
          {
            "text": "automated",
            "start": 1496,
            "end": 1497.02
          },
          {
            "text": "chaos",
            "start": 1497.08,
            "end": 1498.1
          },
          {
            "text": "engineering",
            "start": 1498.15,
            "end": 1499.18
          },
          {
            "text": "test",
            "start": 1499.23,
            "end": 1500.25
          },
          {
            "text": "suite",
            "start": 1500.31,
            "end": 1501.33
          },
          {
            "text": "using",
            "start": 1501.38,
            "end": 1502.41
          },
          {
            "text": "Chaos",
            "start": 1502.46,
            "end": 1503.48
          },
          {
            "text": "Mesh",
            "start": 1503.54,
            "end": 1504.56
          },
          {
            "text": "directly",
            "start": 1504.62,
            "end": 1505.64
          },
          {
            "text": "in",
            "start": 1505.69,
            "end": 1506.72
          },
          {
            "text": "our",
            "start": 1506.77,
            "end": 1507.79
          },
          {
            "text": "staging",
            "start": 1507.85,
            "end": 1508.87
          },
          {
            "text": "environment.",
            "start": 1508.92,
            "end": 1509.95
          }
        ]
      },
      {
        "id": "seg-1-056",
        "speakerId": "spk-3",
        "start": 1512,
        "end": 1536,
        "text": "What specific fault scenarios will that automated suite test Elena?",
        "words": [
          {
            "text": "What",
            "start": 1512,
            "end": 1514.28
          },
          {
            "text": "specific",
            "start": 1514.4,
            "end": 1516.68
          },
          {
            "text": "fault",
            "start": 1516.8,
            "end": 1519.08
          },
          {
            "text": "scenarios",
            "start": 1519.2,
            "end": 1521.48
          },
          {
            "text": "will",
            "start": 1521.6,
            "end": 1523.88
          },
          {
            "text": "that",
            "start": 1524,
            "end": 1526.28
          },
          {
            "text": "automated",
            "start": 1526.4,
            "end": 1528.68
          },
          {
            "text": "suite",
            "start": 1528.8,
            "end": 1531.08
          },
          {
            "text": "test",
            "start": 1531.2,
            "end": 1533.48
          },
          {
            "text": "Elena?",
            "start": 1533.6,
            "end": 1535.88
          }
        ]
      },
      {
        "id": "seg-1-057",
        "speakerId": "spk-5",
        "start": 1538,
        "end": 1568,
        "text": "It will inject packet loss, simulate cross-AZ latency spikes up to two hundred milliseconds, randomly terminate leader broker pods, and corrupt DNS resolution intermittently.",
        "words": [
          {
            "text": "It",
            "start": 1538,
            "end": 1539.19
          },
          {
            "text": "will",
            "start": 1539.25,
            "end": 1540.44
          },
          {
            "text": "inject",
            "start": 1540.5,
            "end": 1541.69
          },
          {
            "text": "packet",
            "start": 1541.75,
            "end": 1542.94
          },
          {
            "text": "loss,",
            "start": 1543,
            "end": 1544.19
          },
          {
            "text": "simulate",
            "start": 1544.25,
            "end": 1545.44
          },
          {
            "text": "cross-AZ",
            "start": 1545.5,
            "end": 1546.69
          },
          {
            "text": "latency",
            "start": 1546.75,
            "end": 1547.94
          },
          {
            "text": "spikes",
            "start": 1548,
            "end": 1549.19
          },
          {
            "text": "up",
            "start": 1549.25,
            "end": 1550.44
          },
          {
            "text": "to",
            "start": 1550.5,
            "end": 1551.69
          },
          {
            "text": "two",
            "start": 1551.75,
            "end": 1552.94
          },
          {
            "text": "hundred",
            "start": 1553,
            "end": 1554.19
          },
          {
            "text": "milliseconds,",
            "start": 1554.25,
            "end": 1555.44
          },
          {
            "text": "randomly",
            "start": 1555.5,
            "end": 1556.69
          },
          {
            "text": "terminate",
            "start": 1556.75,
            "end": 1557.94
          },
          {
            "text": "leader",
            "start": 1558,
            "end": 1559.19
          },
          {
            "text": "broker",
            "start": 1559.25,
            "end": 1560.44
          },
          {
            "text": "pods,",
            "start": 1560.5,
            "end": 1561.69
          },
          {
            "text": "and",
            "start": 1561.75,
            "end": 1562.94
          },
          {
            "text": "corrupt",
            "start": 1563,
            "end": 1564.19
          },
          {
            "text": "DNS",
            "start": 1564.25,
            "end": 1565.44
          },
          {
            "text": "resolution",
            "start": 1565.5,
            "end": 1566.69
          },
          {
            "text": "intermittently.",
            "start": 1566.75,
            "end": 1567.94
          }
        ]
      },
      {
        "id": "seg-1-058",
        "speakerId": "spk-2",
        "start": 1571,
        "end": 1596,
        "text": "Please include DNS TTL caching edge cases. When AWS Route 53 fails over, client resolver caching often delays DNS propagation by up to sixty seconds.",
        "words": [
          {
            "text": "Please",
            "start": 1571,
            "end": 1571.95
          },
          {
            "text": "include",
            "start": 1572,
            "end": 1572.95
          },
          {
            "text": "DNS",
            "start": 1573,
            "end": 1573.95
          },
          {
            "text": "TTL",
            "start": 1574,
            "end": 1574.95
          },
          {
            "text": "caching",
            "start": 1575,
            "end": 1575.95
          },
          {
            "text": "edge",
            "start": 1576,
            "end": 1576.95
          },
          {
            "text": "cases.",
            "start": 1577,
            "end": 1577.95
          },
          {
            "text": "When",
            "start": 1578,
            "end": 1578.95
          },
          {
            "text": "AWS",
            "start": 1579,
            "end": 1579.95
          },
          {
            "text": "Route",
            "start": 1580,
            "end": 1580.95
          },
          {
            "text": "53",
            "start": 1581,
            "end": 1581.95
          },
          {
            "text": "fails",
            "start": 1582,
            "end": 1582.95
          },
          {
            "text": "over,",
            "start": 1583,
            "end": 1583.95
          },
          {
            "text": "client",
            "start": 1584,
            "end": 1584.95
          },
          {
            "text": "resolver",
            "start": 1585,
            "end": 1585.95
          },
          {
            "text": "caching",
            "start": 1586,
            "end": 1586.95
          },
          {
            "text": "often",
            "start": 1587,
            "end": 1587.95
          },
          {
            "text": "delays",
            "start": 1588,
            "end": 1588.95
          },
          {
            "text": "DNS",
            "start": 1589,
            "end": 1589.95
          },
          {
            "text": "propagation",
            "start": 1590,
            "end": 1590.95
          },
          {
            "text": "by",
            "start": 1591,
            "end": 1591.95
          },
          {
            "text": "up",
            "start": 1592,
            "end": 1592.95
          },
          {
            "text": "to",
            "start": 1593,
            "end": 1593.95
          },
          {
            "text": "sixty",
            "start": 1594,
            "end": 1594.95
          },
          {
            "text": "seconds.",
            "start": 1595,
            "end": 1595.95
          }
        ]
      },
      {
        "id": "seg-1-059",
        "speakerId": "spk-5",
        "start": 1598,
        "end": 1623,
        "text": "Excellent catch Alex. I will configure CoreDNS in the cluster with strict five-second negative TTLs and test node resolver behavior under split horizon.",
        "words": [
          {
            "text": "Excellent",
            "start": 1598,
            "end": 1599.03
          },
          {
            "text": "catch",
            "start": 1599.09,
            "end": 1600.12
          },
          {
            "text": "Alex.",
            "start": 1600.17,
            "end": 1601.21
          },
          {
            "text": "I",
            "start": 1601.26,
            "end": 1602.29
          },
          {
            "text": "will",
            "start": 1602.35,
            "end": 1603.38
          },
          {
            "text": "configure",
            "start": 1603.43,
            "end": 1604.47
          },
          {
            "text": "CoreDNS",
            "start": 1604.52,
            "end": 1605.55
          },
          {
            "text": "in",
            "start": 1605.61,
            "end": 1606.64
          },
          {
            "text": "the",
            "start": 1606.7,
            "end": 1607.73
          },
          {
            "text": "cluster",
            "start": 1607.78,
            "end": 1608.82
          },
          {
            "text": "with",
            "start": 1608.87,
            "end": 1609.9
          },
          {
            "text": "strict",
            "start": 1609.96,
            "end": 1610.99
          },
          {
            "text": "five-second",
            "start": 1611.04,
            "end": 1612.08
          },
          {
            "text": "negative",
            "start": 1612.13,
            "end": 1613.16
          },
          {
            "text": "TTLs",
            "start": 1613.22,
            "end": 1614.25
          },
          {
            "text": "and",
            "start": 1614.3,
            "end": 1615.34
          },
          {
            "text": "test",
            "start": 1615.39,
            "end": 1616.42
          },
          {
            "text": "node",
            "start": 1616.48,
            "end": 1617.51
          },
          {
            "text": "resolver",
            "start": 1617.57,
            "end": 1618.6
          },
          {
            "text": "behavior",
            "start": 1618.65,
            "end": 1619.68
          },
          {
            "text": "under",
            "start": 1619.74,
            "end": 1620.77
          },
          {
            "text": "split",
            "start": 1620.83,
            "end": 1621.86
          },
          {
            "text": "horizon.",
            "start": 1621.91,
            "end": 1622.95
          }
        ]
      },
      {
        "id": "seg-1-060",
        "speakerId": "spk-4",
        "start": 1626,
        "end": 1651,
        "text": "I will provide dedicated IAM permissions and a staging cluster namespace for Chaos Mesh so it runs safely without impacting ongoing manual QA testing.",
        "words": [
          {
            "text": "I",
            "start": 1626,
            "end": 1626.99
          },
          {
            "text": "will",
            "start": 1627.04,
            "end": 1628.03
          },
          {
            "text": "provide",
            "start": 1628.08,
            "end": 1629.07
          },
          {
            "text": "dedicated",
            "start": 1629.13,
            "end": 1630.11
          },
          {
            "text": "IAM",
            "start": 1630.17,
            "end": 1631.16
          },
          {
            "text": "permissions",
            "start": 1631.21,
            "end": 1632.2
          },
          {
            "text": "and",
            "start": 1632.25,
            "end": 1633.24
          },
          {
            "text": "a",
            "start": 1633.29,
            "end": 1634.28
          },
          {
            "text": "staging",
            "start": 1634.33,
            "end": 1635.32
          },
          {
            "text": "cluster",
            "start": 1635.38,
            "end": 1636.36
          },
          {
            "text": "namespace",
            "start": 1636.42,
            "end": 1637.41
          },
          {
            "text": "for",
            "start": 1637.46,
            "end": 1638.45
          },
          {
            "text": "Chaos",
            "start": 1638.5,
            "end": 1639.49
          },
          {
            "text": "Mesh",
            "start": 1639.54,
            "end": 1640.53
          },
          {
            "text": "so",
            "start": 1640.58,
            "end": 1641.57
          },
          {
            "text": "it",
            "start": 1641.63,
            "end": 1642.61
          },
          {
            "text": "runs",
            "start": 1642.67,
            "end": 1643.66
          },
          {
            "text": "safely",
            "start": 1643.71,
            "end": 1644.7
          },
          {
            "text": "without",
            "start": 1644.75,
            "end": 1645.74
          },
          {
            "text": "impacting",
            "start": 1645.79,
            "end": 1646.78
          },
          {
            "text": "ongoing",
            "start": 1646.83,
            "end": 1647.82
          },
          {
            "text": "manual",
            "start": 1647.88,
            "end": 1648.86
          },
          {
            "text": "QA",
            "start": 1648.92,
            "end": 1649.91
          },
          {
            "text": "testing.",
            "start": 1649.96,
            "end": 1650.95
          }
        ]
      },
      {
        "id": "seg-1-061",
        "speakerId": "spk-5",
        "start": 1654,
        "end": 1679,
        "text": "Thank you Marcus. I will have the automated chaos test suite for cross-AZ partition tolerance operational and integrated into GitHub Actions by September twenty-eighth.",
        "words": [
          {
            "text": "Thank",
            "start": 1654,
            "end": 1654.99
          },
          {
            "text": "you",
            "start": 1655.04,
            "end": 1656.03
          },
          {
            "text": "Marcus.",
            "start": 1656.08,
            "end": 1657.07
          },
          {
            "text": "I",
            "start": 1657.13,
            "end": 1658.11
          },
          {
            "text": "will",
            "start": 1658.17,
            "end": 1659.16
          },
          {
            "text": "have",
            "start": 1659.21,
            "end": 1660.2
          },
          {
            "text": "the",
            "start": 1660.25,
            "end": 1661.24
          },
          {
            "text": "automated",
            "start": 1661.29,
            "end": 1662.28
          },
          {
            "text": "chaos",
            "start": 1662.33,
            "end": 1663.32
          },
          {
            "text": "test",
            "start": 1663.38,
            "end": 1664.36
          },
          {
            "text": "suite",
            "start": 1664.42,
            "end": 1665.41
          },
          {
            "text": "for",
            "start": 1665.46,
            "end": 1666.45
          },
          {
            "text": "cross-AZ",
            "start": 1666.5,
            "end": 1667.49
          },
          {
            "text": "partition",
            "start": 1667.54,
            "end": 1668.53
          },
          {
            "text": "tolerance",
            "start": 1668.58,
            "end": 1669.57
          },
          {
            "text": "operational",
            "start": 1669.63,
            "end": 1670.61
          },
          {
            "text": "and",
            "start": 1670.67,
            "end": 1671.66
          },
          {
            "text": "integrated",
            "start": 1671.71,
            "end": 1672.7
          },
          {
            "text": "into",
            "start": 1672.75,
            "end": 1673.74
          },
          {
            "text": "GitHub",
            "start": 1673.79,
            "end": 1674.78
          },
          {
            "text": "Actions",
            "start": 1674.83,
            "end": 1675.82
          },
          {
            "text": "by",
            "start": 1675.88,
            "end": 1676.86
          },
          {
            "text": "September",
            "start": 1676.92,
            "end": 1677.91
          },
          {
            "text": "twenty-eighth.",
            "start": 1677.96,
            "end": 1678.95
          }
        ]
      },
      {
        "id": "seg-1-062",
        "speakerId": "spk-1",
        "start": 1682,
        "end": 1707,
        "text": "Make sure the test suite automatically fails the build if failover recovery exceeds five seconds. That will enforce our architectural SLA.",
        "words": [
          {
            "text": "Make",
            "start": 1682,
            "end": 1683.13
          },
          {
            "text": "sure",
            "start": 1683.19,
            "end": 1684.32
          },
          {
            "text": "the",
            "start": 1684.38,
            "end": 1685.51
          },
          {
            "text": "test",
            "start": 1685.57,
            "end": 1686.7
          },
          {
            "text": "suite",
            "start": 1686.76,
            "end": 1687.89
          },
          {
            "text": "automatically",
            "start": 1687.95,
            "end": 1689.08
          },
          {
            "text": "fails",
            "start": 1689.14,
            "end": 1690.27
          },
          {
            "text": "the",
            "start": 1690.33,
            "end": 1691.46
          },
          {
            "text": "build",
            "start": 1691.52,
            "end": 1692.65
          },
          {
            "text": "if",
            "start": 1692.71,
            "end": 1693.85
          },
          {
            "text": "failover",
            "start": 1693.9,
            "end": 1695.04
          },
          {
            "text": "recovery",
            "start": 1695.1,
            "end": 1696.23
          },
          {
            "text": "exceeds",
            "start": 1696.29,
            "end": 1697.42
          },
          {
            "text": "five",
            "start": 1697.48,
            "end": 1698.61
          },
          {
            "text": "seconds.",
            "start": 1698.67,
            "end": 1699.8
          },
          {
            "text": "That",
            "start": 1699.86,
            "end": 1700.99
          },
          {
            "text": "will",
            "start": 1701.05,
            "end": 1702.18
          },
          {
            "text": "enforce",
            "start": 1702.24,
            "end": 1703.37
          },
          {
            "text": "our",
            "start": 1703.43,
            "end": 1704.56
          },
          {
            "text": "architectural",
            "start": 1704.62,
            "end": 1705.75
          },
          {
            "text": "SLA.",
            "start": 1705.81,
            "end": 1706.94
          }
        ]
      },
      {
        "id": "seg-1-063",
        "speakerId": "spk-6",
        "start": 1710,
        "end": 1738,
        "text": "Let's review our event streaming backbone. David here. During normal operations, Kafka processes ninety-five thousand audio packet chunks per second with negligible lag.",
        "words": [
          {
            "text": "Let's",
            "start": 1710,
            "end": 1711.16
          },
          {
            "text": "review",
            "start": 1711.22,
            "end": 1712.37
          },
          {
            "text": "our",
            "start": 1712.43,
            "end": 1713.59
          },
          {
            "text": "event",
            "start": 1713.65,
            "end": 1714.81
          },
          {
            "text": "streaming",
            "start": 1714.87,
            "end": 1716.03
          },
          {
            "text": "backbone.",
            "start": 1716.09,
            "end": 1717.24
          },
          {
            "text": "David",
            "start": 1717.3,
            "end": 1718.46
          },
          {
            "text": "here.",
            "start": 1718.52,
            "end": 1719.68
          },
          {
            "text": "During",
            "start": 1719.74,
            "end": 1720.9
          },
          {
            "text": "normal",
            "start": 1720.96,
            "end": 1722.11
          },
          {
            "text": "operations,",
            "start": 1722.17,
            "end": 1723.33
          },
          {
            "text": "Kafka",
            "start": 1723.39,
            "end": 1724.55
          },
          {
            "text": "processes",
            "start": 1724.61,
            "end": 1725.77
          },
          {
            "text": "ninety-five",
            "start": 1725.83,
            "end": 1726.98
          },
          {
            "text": "thousand",
            "start": 1727.04,
            "end": 1728.2
          },
          {
            "text": "audio",
            "start": 1728.26,
            "end": 1729.42
          },
          {
            "text": "packet",
            "start": 1729.48,
            "end": 1730.63
          },
          {
            "text": "chunks",
            "start": 1730.7,
            "end": 1731.85
          },
          {
            "text": "per",
            "start": 1731.91,
            "end": 1733.07
          },
          {
            "text": "second",
            "start": 1733.13,
            "end": 1734.29
          },
          {
            "text": "with",
            "start": 1734.35,
            "end": 1735.5
          },
          {
            "text": "negligible",
            "start": 1735.57,
            "end": 1736.72
          },
          {
            "text": "lag.",
            "start": 1736.78,
            "end": 1737.94
          }
        ]
      },
      {
        "id": "seg-1-064",
        "speakerId": "spk-6",
        "start": 1740,
        "end": 1768,
        "text": "However, whenever an audio transcription worker crashes, the consumer group undergoes a cooperative sticky rebalance that pauses consumption for six to twelve seconds.",
        "words": [
          {
            "text": "However,",
            "start": 1740,
            "end": 1741.16
          },
          {
            "text": "whenever",
            "start": 1741.22,
            "end": 1742.37
          },
          {
            "text": "an",
            "start": 1742.43,
            "end": 1743.59
          },
          {
            "text": "audio",
            "start": 1743.65,
            "end": 1744.81
          },
          {
            "text": "transcription",
            "start": 1744.87,
            "end": 1746.03
          },
          {
            "text": "worker",
            "start": 1746.09,
            "end": 1747.24
          },
          {
            "text": "crashes,",
            "start": 1747.3,
            "end": 1748.46
          },
          {
            "text": "the",
            "start": 1748.52,
            "end": 1749.68
          },
          {
            "text": "consumer",
            "start": 1749.74,
            "end": 1750.9
          },
          {
            "text": "group",
            "start": 1750.96,
            "end": 1752.11
          },
          {
            "text": "undergoes",
            "start": 1752.17,
            "end": 1753.33
          },
          {
            "text": "a",
            "start": 1753.39,
            "end": 1754.55
          },
          {
            "text": "cooperative",
            "start": 1754.61,
            "end": 1755.77
          },
          {
            "text": "sticky",
            "start": 1755.83,
            "end": 1756.98
          },
          {
            "text": "rebalance",
            "start": 1757.04,
            "end": 1758.2
          },
          {
            "text": "that",
            "start": 1758.26,
            "end": 1759.42
          },
          {
            "text": "pauses",
            "start": 1759.48,
            "end": 1760.63
          },
          {
            "text": "consumption",
            "start": 1760.7,
            "end": 1761.85
          },
          {
            "text": "for",
            "start": 1761.91,
            "end": 1763.07
          },
          {
            "text": "six",
            "start": 1763.13,
            "end": 1764.29
          },
          {
            "text": "to",
            "start": 1764.35,
            "end": 1765.5
          },
          {
            "text": "twelve",
            "start": 1765.57,
            "end": 1766.72
          },
          {
            "text": "seconds.",
            "start": 1766.78,
            "end": 1767.94
          }
        ]
      },
      {
        "id": "seg-1-065",
        "speakerId": "spk-7",
        "start": 1770,
        "end": 1796,
        "text": "From the user's perspective, those twelve seconds cause the live transcription words to freeze on screen, and then suddenly burst forward in a jarring jump.",
        "words": [
          {
            "text": "From",
            "start": 1770,
            "end": 1770.99
          },
          {
            "text": "the",
            "start": 1771.04,
            "end": 1772.03
          },
          {
            "text": "user's",
            "start": 1772.08,
            "end": 1773.07
          },
          {
            "text": "perspective,",
            "start": 1773.12,
            "end": 1774.11
          },
          {
            "text": "those",
            "start": 1774.16,
            "end": 1775.15
          },
          {
            "text": "twelve",
            "start": 1775.2,
            "end": 1776.19
          },
          {
            "text": "seconds",
            "start": 1776.24,
            "end": 1777.23
          },
          {
            "text": "cause",
            "start": 1777.28,
            "end": 1778.27
          },
          {
            "text": "the",
            "start": 1778.32,
            "end": 1779.31
          },
          {
            "text": "live",
            "start": 1779.36,
            "end": 1780.35
          },
          {
            "text": "transcription",
            "start": 1780.4,
            "end": 1781.39
          },
          {
            "text": "words",
            "start": 1781.44,
            "end": 1782.43
          },
          {
            "text": "to",
            "start": 1782.48,
            "end": 1783.47
          },
          {
            "text": "freeze",
            "start": 1783.52,
            "end": 1784.51
          },
          {
            "text": "on",
            "start": 1784.56,
            "end": 1785.55
          },
          {
            "text": "screen,",
            "start": 1785.6,
            "end": 1786.59
          },
          {
            "text": "and",
            "start": 1786.64,
            "end": 1787.63
          },
          {
            "text": "then",
            "start": 1787.68,
            "end": 1788.67
          },
          {
            "text": "suddenly",
            "start": 1788.72,
            "end": 1789.71
          },
          {
            "text": "burst",
            "start": 1789.76,
            "end": 1790.75
          },
          {
            "text": "forward",
            "start": 1790.8,
            "end": 1791.79
          },
          {
            "text": "in",
            "start": 1791.84,
            "end": 1792.83
          },
          {
            "text": "a",
            "start": 1792.88,
            "end": 1793.87
          },
          {
            "text": "jarring",
            "start": 1793.92,
            "end": 1794.91
          },
          {
            "text": "jump.",
            "start": 1794.96,
            "end": 1795.95
          }
        ]
      },
      {
        "id": "seg-1-066",
        "speakerId": "spk-6",
        "start": 1798,
        "end": 1825,
        "text": "Exactly. The fix is moving from eager rebalancing to incremental cooperative rebalancing and tuning our heartbeat interval down from three seconds to eight hundred milliseconds.",
        "words": [
          {
            "text": "Exactly.",
            "start": 1798,
            "end": 1799.03
          },
          {
            "text": "The",
            "start": 1799.08,
            "end": 1800.11
          },
          {
            "text": "fix",
            "start": 1800.16,
            "end": 1801.19
          },
          {
            "text": "is",
            "start": 1801.24,
            "end": 1802.27
          },
          {
            "text": "moving",
            "start": 1802.32,
            "end": 1803.35
          },
          {
            "text": "from",
            "start": 1803.4,
            "end": 1804.43
          },
          {
            "text": "eager",
            "start": 1804.48,
            "end": 1805.51
          },
          {
            "text": "rebalancing",
            "start": 1805.56,
            "end": 1806.59
          },
          {
            "text": "to",
            "start": 1806.64,
            "end": 1807.67
          },
          {
            "text": "incremental",
            "start": 1807.72,
            "end": 1808.75
          },
          {
            "text": "cooperative",
            "start": 1808.8,
            "end": 1809.83
          },
          {
            "text": "rebalancing",
            "start": 1809.88,
            "end": 1810.91
          },
          {
            "text": "and",
            "start": 1810.96,
            "end": 1811.99
          },
          {
            "text": "tuning",
            "start": 1812.04,
            "end": 1813.07
          },
          {
            "text": "our",
            "start": 1813.12,
            "end": 1814.15
          },
          {
            "text": "heartbeat",
            "start": 1814.2,
            "end": 1815.23
          },
          {
            "text": "interval",
            "start": 1815.28,
            "end": 1816.31
          },
          {
            "text": "down",
            "start": 1816.36,
            "end": 1817.39
          },
          {
            "text": "from",
            "start": 1817.44,
            "end": 1818.47
          },
          {
            "text": "three",
            "start": 1818.52,
            "end": 1819.55
          },
          {
            "text": "seconds",
            "start": 1819.6,
            "end": 1820.63
          },
          {
            "text": "to",
            "start": 1820.68,
            "end": 1821.71
          },
          {
            "text": "eight",
            "start": 1821.76,
            "end": 1822.79
          },
          {
            "text": "hundred",
            "start": 1822.84,
            "end": 1823.87
          },
          {
            "text": "milliseconds.",
            "start": 1823.92,
            "end": 1824.95
          }
        ]
      },
      {
        "id": "seg-1-067",
        "speakerId": "spk-1",
        "start": 1827,
        "end": 1853,
        "text": "What about partition counts on the high-throughput transcript-words topic? Are we seeing hot partition bottlenecks on broker node two?",
        "words": [
          {
            "text": "What",
            "start": 1827,
            "end": 1828.3
          },
          {
            "text": "about",
            "start": 1828.37,
            "end": 1829.67
          },
          {
            "text": "partition",
            "start": 1829.74,
            "end": 1831.04
          },
          {
            "text": "counts",
            "start": 1831.11,
            "end": 1832.41
          },
          {
            "text": "on",
            "start": 1832.47,
            "end": 1833.77
          },
          {
            "text": "the",
            "start": 1833.84,
            "end": 1835.14
          },
          {
            "text": "high-throughput",
            "start": 1835.21,
            "end": 1836.51
          },
          {
            "text": "transcript-words",
            "start": 1836.58,
            "end": 1837.88
          },
          {
            "text": "topic?",
            "start": 1837.95,
            "end": 1839.25
          },
          {
            "text": "Are",
            "start": 1839.32,
            "end": 1840.62
          },
          {
            "text": "we",
            "start": 1840.68,
            "end": 1841.98
          },
          {
            "text": "seeing",
            "start": 1842.05,
            "end": 1843.35
          },
          {
            "text": "hot",
            "start": 1843.42,
            "end": 1844.72
          },
          {
            "text": "partition",
            "start": 1844.79,
            "end": 1846.09
          },
          {
            "text": "bottlenecks",
            "start": 1846.16,
            "end": 1847.46
          },
          {
            "text": "on",
            "start": 1847.53,
            "end": 1848.83
          },
          {
            "text": "broker",
            "start": 1848.89,
            "end": 1850.19
          },
          {
            "text": "node",
            "start": 1850.26,
            "end": 1851.56
          },
          {
            "text": "two?",
            "start": 1851.63,
            "end": 1852.93
          }
        ]
      },
      {
        "id": "seg-1-068",
        "speakerId": "spk-6",
        "start": 1855,
        "end": 1883,
        "text": "Yes, because we were previously partitioning strictly by meeting ID. If a single enterprise all-hands meeting has eight thousand attendees, that partition receives ninety percent of traffic.",
        "words": [
          {
            "text": "Yes,",
            "start": 1855,
            "end": 1855.99
          },
          {
            "text": "because",
            "start": 1856.04,
            "end": 1857.02
          },
          {
            "text": "we",
            "start": 1857.07,
            "end": 1858.06
          },
          {
            "text": "were",
            "start": 1858.11,
            "end": 1859.1
          },
          {
            "text": "previously",
            "start": 1859.15,
            "end": 1860.13
          },
          {
            "text": "partitioning",
            "start": 1860.19,
            "end": 1861.17
          },
          {
            "text": "strictly",
            "start": 1861.22,
            "end": 1862.21
          },
          {
            "text": "by",
            "start": 1862.26,
            "end": 1863.24
          },
          {
            "text": "meeting",
            "start": 1863.3,
            "end": 1864.28
          },
          {
            "text": "ID.",
            "start": 1864.33,
            "end": 1865.32
          },
          {
            "text": "If",
            "start": 1865.37,
            "end": 1866.36
          },
          {
            "text": "a",
            "start": 1866.41,
            "end": 1867.39
          },
          {
            "text": "single",
            "start": 1867.44,
            "end": 1868.43
          },
          {
            "text": "enterprise",
            "start": 1868.48,
            "end": 1869.47
          },
          {
            "text": "all-hands",
            "start": 1869.52,
            "end": 1870.5
          },
          {
            "text": "meeting",
            "start": 1870.56,
            "end": 1871.54
          },
          {
            "text": "has",
            "start": 1871.59,
            "end": 1872.58
          },
          {
            "text": "eight",
            "start": 1872.63,
            "end": 1873.61
          },
          {
            "text": "thousand",
            "start": 1873.67,
            "end": 1874.65
          },
          {
            "text": "attendees,",
            "start": 1874.7,
            "end": 1875.69
          },
          {
            "text": "that",
            "start": 1875.74,
            "end": 1876.73
          },
          {
            "text": "partition",
            "start": 1876.78,
            "end": 1877.76
          },
          {
            "text": "receives",
            "start": 1877.81,
            "end": 1878.8
          },
          {
            "text": "ninety",
            "start": 1878.85,
            "end": 1879.84
          },
          {
            "text": "percent",
            "start": 1879.89,
            "end": 1880.87
          },
          {
            "text": "of",
            "start": 1880.93,
            "end": 1881.91
          },
          {
            "text": "traffic.",
            "start": 1881.96,
            "end": 1882.95
          }
        ]
      },
      {
        "id": "seg-1-069",
        "speakerId": "spk-2",
        "start": 1886,
        "end": 1913,
        "text": "We should switch the partition key to a composite hash of meeting ID plus speaker ID. That will distribute the load evenly across all twenty-four partitions.",
        "words": [
          {
            "text": "We",
            "start": 1886,
            "end": 1886.99
          },
          {
            "text": "should",
            "start": 1887.04,
            "end": 1888.03
          },
          {
            "text": "switch",
            "start": 1888.08,
            "end": 1889.06
          },
          {
            "text": "the",
            "start": 1889.12,
            "end": 1890.1
          },
          {
            "text": "partition",
            "start": 1890.15,
            "end": 1891.14
          },
          {
            "text": "key",
            "start": 1891.19,
            "end": 1892.18
          },
          {
            "text": "to",
            "start": 1892.23,
            "end": 1893.22
          },
          {
            "text": "a",
            "start": 1893.27,
            "end": 1894.26
          },
          {
            "text": "composite",
            "start": 1894.31,
            "end": 1895.29
          },
          {
            "text": "hash",
            "start": 1895.35,
            "end": 1896.33
          },
          {
            "text": "of",
            "start": 1896.38,
            "end": 1897.37
          },
          {
            "text": "meeting",
            "start": 1897.42,
            "end": 1898.41
          },
          {
            "text": "ID",
            "start": 1898.46,
            "end": 1899.45
          },
          {
            "text": "plus",
            "start": 1899.5,
            "end": 1900.49
          },
          {
            "text": "speaker",
            "start": 1900.54,
            "end": 1901.53
          },
          {
            "text": "ID.",
            "start": 1901.58,
            "end": 1902.56
          },
          {
            "text": "That",
            "start": 1902.62,
            "end": 1903.6
          },
          {
            "text": "will",
            "start": 1903.65,
            "end": 1904.64
          },
          {
            "text": "distribute",
            "start": 1904.69,
            "end": 1905.68
          },
          {
            "text": "the",
            "start": 1905.73,
            "end": 1906.72
          },
          {
            "text": "load",
            "start": 1906.77,
            "end": 1907.76
          },
          {
            "text": "evenly",
            "start": 1907.81,
            "end": 1908.79
          },
          {
            "text": "across",
            "start": 1908.85,
            "end": 1909.83
          },
          {
            "text": "all",
            "start": 1909.88,
            "end": 1910.87
          },
          {
            "text": "twenty-four",
            "start": 1910.92,
            "end": 1911.91
          },
          {
            "text": "partitions.",
            "start": 1911.96,
            "end": 1912.95
          }
        ]
      },
      {
        "id": "seg-1-070",
        "speakerId": "spk-5",
        "start": 1916,
        "end": 1941,
        "text": "How do we protect consumers from poison-pill payloads that crash the deserialization loop repeatedly?",
        "words": [
          {
            "text": "How",
            "start": 1916,
            "end": 1917.7
          },
          {
            "text": "do",
            "start": 1917.79,
            "end": 1919.48
          },
          {
            "text": "we",
            "start": 1919.57,
            "end": 1921.27
          },
          {
            "text": "protect",
            "start": 1921.36,
            "end": 1923.05
          },
          {
            "text": "consumers",
            "start": 1923.14,
            "end": 1924.84
          },
          {
            "text": "from",
            "start": 1924.93,
            "end": 1926.63
          },
          {
            "text": "poison-pill",
            "start": 1926.71,
            "end": 1928.41
          },
          {
            "text": "payloads",
            "start": 1928.5,
            "end": 1930.2
          },
          {
            "text": "that",
            "start": 1930.29,
            "end": 1931.98
          },
          {
            "text": "crash",
            "start": 1932.07,
            "end": 1933.77
          },
          {
            "text": "the",
            "start": 1933.86,
            "end": 1935.55
          },
          {
            "text": "deserialization",
            "start": 1935.64,
            "end": 1937.34
          },
          {
            "text": "loop",
            "start": 1937.43,
            "end": 1939.13
          },
          {
            "text": "repeatedly?",
            "start": 1939.21,
            "end": 1940.91
          }
        ]
      },
      {
        "id": "seg-1-071",
        "speakerId": "spk-6",
        "start": 1944,
        "end": 1970,
        "text": "We are introducing a dead-letter queue with exponential retry backoff. Poison messages get shunted to the DLQ after three retries without stalling the partition.",
        "words": [
          {
            "text": "We",
            "start": 1944,
            "end": 1945.03
          },
          {
            "text": "are",
            "start": 1945.08,
            "end": 1946.11
          },
          {
            "text": "introducing",
            "start": 1946.17,
            "end": 1947.2
          },
          {
            "text": "a",
            "start": 1947.25,
            "end": 1948.28
          },
          {
            "text": "dead-letter",
            "start": 1948.33,
            "end": 1949.36
          },
          {
            "text": "queue",
            "start": 1949.42,
            "end": 1950.45
          },
          {
            "text": "with",
            "start": 1950.5,
            "end": 1951.53
          },
          {
            "text": "exponential",
            "start": 1951.58,
            "end": 1952.61
          },
          {
            "text": "retry",
            "start": 1952.67,
            "end": 1953.7
          },
          {
            "text": "backoff.",
            "start": 1953.75,
            "end": 1954.78
          },
          {
            "text": "Poison",
            "start": 1954.83,
            "end": 1955.86
          },
          {
            "text": "messages",
            "start": 1955.92,
            "end": 1956.95
          },
          {
            "text": "get",
            "start": 1957,
            "end": 1958.03
          },
          {
            "text": "shunted",
            "start": 1958.08,
            "end": 1959.11
          },
          {
            "text": "to",
            "start": 1959.17,
            "end": 1960.2
          },
          {
            "text": "the",
            "start": 1960.25,
            "end": 1961.28
          },
          {
            "text": "DLQ",
            "start": 1961.33,
            "end": 1962.36
          },
          {
            "text": "after",
            "start": 1962.42,
            "end": 1963.45
          },
          {
            "text": "three",
            "start": 1963.5,
            "end": 1964.53
          },
          {
            "text": "retries",
            "start": 1964.58,
            "end": 1965.61
          },
          {
            "text": "without",
            "start": 1965.67,
            "end": 1966.7
          },
          {
            "text": "stalling",
            "start": 1966.75,
            "end": 1967.78
          },
          {
            "text": "the",
            "start": 1967.83,
            "end": 1968.86
          },
          {
            "text": "partition.",
            "start": 1968.92,
            "end": 1969.95
          }
        ]
      },
      {
        "id": "seg-1-072",
        "speakerId": "spk-6",
        "start": 1972,
        "end": 1998,
        "text": "I will audit our Kafka consumer group lag and implement the partition key hashing, dead-letter queue, and timeout tuning by September twenty-first.",
        "words": [
          {
            "text": "I",
            "start": 1972,
            "end": 1973.12
          },
          {
            "text": "will",
            "start": 1973.18,
            "end": 1974.3
          },
          {
            "text": "audit",
            "start": 1974.36,
            "end": 1975.49
          },
          {
            "text": "our",
            "start": 1975.55,
            "end": 1976.67
          },
          {
            "text": "Kafka",
            "start": 1976.73,
            "end": 1977.85
          },
          {
            "text": "consumer",
            "start": 1977.91,
            "end": 1979.03
          },
          {
            "text": "group",
            "start": 1979.09,
            "end": 1980.21
          },
          {
            "text": "lag",
            "start": 1980.27,
            "end": 1981.4
          },
          {
            "text": "and",
            "start": 1981.45,
            "end": 1982.58
          },
          {
            "text": "implement",
            "start": 1982.64,
            "end": 1983.76
          },
          {
            "text": "the",
            "start": 1983.82,
            "end": 1984.94
          },
          {
            "text": "partition",
            "start": 1985,
            "end": 1986.12
          },
          {
            "text": "key",
            "start": 1986.18,
            "end": 1987.3
          },
          {
            "text": "hashing,",
            "start": 1987.36,
            "end": 1988.49
          },
          {
            "text": "dead-letter",
            "start": 1988.55,
            "end": 1989.67
          },
          {
            "text": "queue,",
            "start": 1989.73,
            "end": 1990.85
          },
          {
            "text": "and",
            "start": 1990.91,
            "end": 1992.03
          },
          {
            "text": "timeout",
            "start": 1992.09,
            "end": 1993.21
          },
          {
            "text": "tuning",
            "start": 1993.27,
            "end": 1994.4
          },
          {
            "text": "by",
            "start": 1994.45,
            "end": 1995.58
          },
          {
            "text": "September",
            "start": 1995.64,
            "end": 1996.76
          },
          {
            "text": "twenty-first.",
            "start": 1996.82,
            "end": 1997.94
          }
        ]
      },
      {
        "id": "seg-1-073",
        "speakerId": "spk-8",
        "start": 2000,
        "end": 2025,
        "text": "David, ensure that Kafka topic retention policies comply with our data retention schedule. Audio chunks must expire after twenty-four hours once transcription completes.",
        "words": [
          {
            "text": "David,",
            "start": 2000,
            "end": 2001.03
          },
          {
            "text": "ensure",
            "start": 2001.09,
            "end": 2002.12
          },
          {
            "text": "that",
            "start": 2002.17,
            "end": 2003.21
          },
          {
            "text": "Kafka",
            "start": 2003.26,
            "end": 2004.29
          },
          {
            "text": "topic",
            "start": 2004.35,
            "end": 2005.38
          },
          {
            "text": "retention",
            "start": 2005.43,
            "end": 2006.47
          },
          {
            "text": "policies",
            "start": 2006.52,
            "end": 2007.55
          },
          {
            "text": "comply",
            "start": 2007.61,
            "end": 2008.64
          },
          {
            "text": "with",
            "start": 2008.7,
            "end": 2009.73
          },
          {
            "text": "our",
            "start": 2009.78,
            "end": 2010.82
          },
          {
            "text": "data",
            "start": 2010.87,
            "end": 2011.9
          },
          {
            "text": "retention",
            "start": 2011.96,
            "end": 2012.99
          },
          {
            "text": "schedule.",
            "start": 2013.04,
            "end": 2014.08
          },
          {
            "text": "Audio",
            "start": 2014.13,
            "end": 2015.16
          },
          {
            "text": "chunks",
            "start": 2015.22,
            "end": 2016.25
          },
          {
            "text": "must",
            "start": 2016.3,
            "end": 2017.34
          },
          {
            "text": "expire",
            "start": 2017.39,
            "end": 2018.42
          },
          {
            "text": "after",
            "start": 2018.48,
            "end": 2019.51
          },
          {
            "text": "twenty-four",
            "start": 2019.57,
            "end": 2020.6
          },
          {
            "text": "hours",
            "start": 2020.65,
            "end": 2021.68
          },
          {
            "text": "once",
            "start": 2021.74,
            "end": 2022.77
          },
          {
            "text": "transcription",
            "start": 2022.83,
            "end": 2023.86
          },
          {
            "text": "completes.",
            "start": 2023.91,
            "end": 2024.95
          }
        ]
      },
      {
        "id": "seg-1-074",
        "speakerId": "spk-6",
        "start": 2028,
        "end": 2053,
        "text": "Noted James. Tiered storage will automatically archive raw chunks to S3 with Glacier instant retrieval after twenty-four hours.",
        "words": [
          {
            "text": "Noted",
            "start": 2028,
            "end": 2029.32
          },
          {
            "text": "James.",
            "start": 2029.39,
            "end": 2030.71
          },
          {
            "text": "Tiered",
            "start": 2030.78,
            "end": 2032.1
          },
          {
            "text": "storage",
            "start": 2032.17,
            "end": 2033.49
          },
          {
            "text": "will",
            "start": 2033.56,
            "end": 2034.88
          },
          {
            "text": "automatically",
            "start": 2034.94,
            "end": 2036.26
          },
          {
            "text": "archive",
            "start": 2036.33,
            "end": 2037.65
          },
          {
            "text": "raw",
            "start": 2037.72,
            "end": 2039.04
          },
          {
            "text": "chunks",
            "start": 2039.11,
            "end": 2040.43
          },
          {
            "text": "to",
            "start": 2040.5,
            "end": 2041.82
          },
          {
            "text": "S3",
            "start": 2041.89,
            "end": 2043.21
          },
          {
            "text": "with",
            "start": 2043.28,
            "end": 2044.6
          },
          {
            "text": "Glacier",
            "start": 2044.67,
            "end": 2045.99
          },
          {
            "text": "instant",
            "start": 2046.06,
            "end": 2047.38
          },
          {
            "text": "retrieval",
            "start": 2047.44,
            "end": 2048.76
          },
          {
            "text": "after",
            "start": 2048.83,
            "end": 2050.15
          },
          {
            "text": "twenty-four",
            "start": 2050.22,
            "end": 2051.54
          },
          {
            "text": "hours.",
            "start": 2051.61,
            "end": 2052.93
          }
        ]
      },
      {
        "id": "seg-1-075",
        "speakerId": "spk-7",
        "start": 2055,
        "end": 2083,
        "text": "Moving to the frontend and user experience. Maya here. Our meeting detail page has grown in complexity with the video player, multi-template notes, and interactive transcript.",
        "words": [
          {
            "text": "Moving",
            "start": 2055,
            "end": 2056.02
          },
          {
            "text": "to",
            "start": 2056.08,
            "end": 2057.1
          },
          {
            "text": "the",
            "start": 2057.15,
            "end": 2058.18
          },
          {
            "text": "frontend",
            "start": 2058.23,
            "end": 2059.25
          },
          {
            "text": "and",
            "start": 2059.31,
            "end": 2060.33
          },
          {
            "text": "user",
            "start": 2060.38,
            "end": 2061.41
          },
          {
            "text": "experience.",
            "start": 2061.46,
            "end": 2062.48
          },
          {
            "text": "Maya",
            "start": 2062.54,
            "end": 2063.56
          },
          {
            "text": "here.",
            "start": 2063.62,
            "end": 2064.64
          },
          {
            "text": "Our",
            "start": 2064.69,
            "end": 2065.72
          },
          {
            "text": "meeting",
            "start": 2065.77,
            "end": 2066.79
          },
          {
            "text": "detail",
            "start": 2066.85,
            "end": 2067.87
          },
          {
            "text": "page",
            "start": 2067.92,
            "end": 2068.95
          },
          {
            "text": "has",
            "start": 2069,
            "end": 2070.02
          },
          {
            "text": "grown",
            "start": 2070.08,
            "end": 2071.1
          },
          {
            "text": "in",
            "start": 2071.15,
            "end": 2072.18
          },
          {
            "text": "complexity",
            "start": 2072.23,
            "end": 2073.25
          },
          {
            "text": "with",
            "start": 2073.31,
            "end": 2074.33
          },
          {
            "text": "the",
            "start": 2074.38,
            "end": 2075.41
          },
          {
            "text": "video",
            "start": 2075.46,
            "end": 2076.48
          },
          {
            "text": "player,",
            "start": 2076.54,
            "end": 2077.56
          },
          {
            "text": "multi-template",
            "start": 2077.62,
            "end": 2078.64
          },
          {
            "text": "notes,",
            "start": 2078.69,
            "end": 2079.72
          },
          {
            "text": "and",
            "start": 2079.77,
            "end": 2080.79
          },
          {
            "text": "interactive",
            "start": 2080.85,
            "end": 2081.87
          },
          {
            "text": "transcript.",
            "start": 2081.92,
            "end": 2082.95
          }
        ]
      },
      {
        "id": "seg-1-076",
        "speakerId": "spk-7",
        "start": 2085,
        "end": 2113,
        "text": "Our Lighthouse performance score dropped to seventy-six because the initial JavaScript bundle was two hundred and eighty kilobytes, causing a one point two second First Input Delay.",
        "words": [
          {
            "text": "Our",
            "start": 2085,
            "end": 2085.99
          },
          {
            "text": "Lighthouse",
            "start": 2086.04,
            "end": 2087.02
          },
          {
            "text": "performance",
            "start": 2087.07,
            "end": 2088.06
          },
          {
            "text": "score",
            "start": 2088.11,
            "end": 2089.1
          },
          {
            "text": "dropped",
            "start": 2089.15,
            "end": 2090.13
          },
          {
            "text": "to",
            "start": 2090.19,
            "end": 2091.17
          },
          {
            "text": "seventy-six",
            "start": 2091.22,
            "end": 2092.21
          },
          {
            "text": "because",
            "start": 2092.26,
            "end": 2093.24
          },
          {
            "text": "the",
            "start": 2093.3,
            "end": 2094.28
          },
          {
            "text": "initial",
            "start": 2094.33,
            "end": 2095.32
          },
          {
            "text": "JavaScript",
            "start": 2095.37,
            "end": 2096.36
          },
          {
            "text": "bundle",
            "start": 2096.41,
            "end": 2097.39
          },
          {
            "text": "was",
            "start": 2097.44,
            "end": 2098.43
          },
          {
            "text": "two",
            "start": 2098.48,
            "end": 2099.47
          },
          {
            "text": "hundred",
            "start": 2099.52,
            "end": 2100.5
          },
          {
            "text": "and",
            "start": 2100.56,
            "end": 2101.54
          },
          {
            "text": "eighty",
            "start": 2101.59,
            "end": 2102.58
          },
          {
            "text": "kilobytes,",
            "start": 2102.63,
            "end": 2103.61
          },
          {
            "text": "causing",
            "start": 2103.67,
            "end": 2104.65
          },
          {
            "text": "a",
            "start": 2104.7,
            "end": 2105.69
          },
          {
            "text": "one",
            "start": 2105.74,
            "end": 2106.73
          },
          {
            "text": "point",
            "start": 2106.78,
            "end": 2107.76
          },
          {
            "text": "two",
            "start": 2107.81,
            "end": 2108.8
          },
          {
            "text": "second",
            "start": 2108.85,
            "end": 2109.84
          },
          {
            "text": "First",
            "start": 2109.89,
            "end": 2110.87
          },
          {
            "text": "Input",
            "start": 2110.93,
            "end": 2111.91
          },
          {
            "text": "Delay.",
            "start": 2111.96,
            "end": 2112.95
          }
        ]
      },
      {
        "id": "seg-1-077",
        "speakerId": "spk-3",
        "start": 2115,
        "end": 2141,
        "text": "That directly impacts our Core Web Vitals and reviewer first impressions. How do we get the bundle back under budget Maya?",
        "words": [
          {
            "text": "That",
            "start": 2115,
            "end": 2116.18
          },
          {
            "text": "directly",
            "start": 2116.24,
            "end": 2117.41
          },
          {
            "text": "impacts",
            "start": 2117.48,
            "end": 2118.65
          },
          {
            "text": "our",
            "start": 2118.71,
            "end": 2119.89
          },
          {
            "text": "Core",
            "start": 2119.95,
            "end": 2121.13
          },
          {
            "text": "Web",
            "start": 2121.19,
            "end": 2122.37
          },
          {
            "text": "Vitals",
            "start": 2122.43,
            "end": 2123.6
          },
          {
            "text": "and",
            "start": 2123.67,
            "end": 2124.84
          },
          {
            "text": "reviewer",
            "start": 2124.9,
            "end": 2126.08
          },
          {
            "text": "first",
            "start": 2126.14,
            "end": 2127.32
          },
          {
            "text": "impressions.",
            "start": 2127.38,
            "end": 2128.56
          },
          {
            "text": "How",
            "start": 2128.62,
            "end": 2129.8
          },
          {
            "text": "do",
            "start": 2129.86,
            "end": 2131.03
          },
          {
            "text": "we",
            "start": 2131.1,
            "end": 2132.27
          },
          {
            "text": "get",
            "start": 2132.33,
            "end": 2133.51
          },
          {
            "text": "the",
            "start": 2133.57,
            "end": 2134.75
          },
          {
            "text": "bundle",
            "start": 2134.81,
            "end": 2135.99
          },
          {
            "text": "back",
            "start": 2136.05,
            "end": 2137.22
          },
          {
            "text": "under",
            "start": 2137.29,
            "end": 2138.46
          },
          {
            "text": "budget",
            "start": 2138.52,
            "end": 2139.7
          },
          {
            "text": "Maya?",
            "start": 2139.76,
            "end": 2140.94
          }
        ]
      },
      {
        "id": "seg-1-078",
        "speakerId": "spk-7",
        "start": 2142,
        "end": 2170,
        "text": "We are implementing three changes: first, dynamic code-splitting for heavy modals like the clip share and export dialogs. Second, moving transcript search indexing into a Web Worker.",
        "words": [
          {
            "text": "We",
            "start": 2142,
            "end": 2142.99
          },
          {
            "text": "are",
            "start": 2143.04,
            "end": 2144.02
          },
          {
            "text": "implementing",
            "start": 2144.07,
            "end": 2145.06
          },
          {
            "text": "three",
            "start": 2145.11,
            "end": 2146.1
          },
          {
            "text": "changes:",
            "start": 2146.15,
            "end": 2147.13
          },
          {
            "text": "first,",
            "start": 2147.19,
            "end": 2148.17
          },
          {
            "text": "dynamic",
            "start": 2148.22,
            "end": 2149.21
          },
          {
            "text": "code-splitting",
            "start": 2149.26,
            "end": 2150.24
          },
          {
            "text": "for",
            "start": 2150.3,
            "end": 2151.28
          },
          {
            "text": "heavy",
            "start": 2151.33,
            "end": 2152.32
          },
          {
            "text": "modals",
            "start": 2152.37,
            "end": 2153.36
          },
          {
            "text": "like",
            "start": 2153.41,
            "end": 2154.39
          },
          {
            "text": "the",
            "start": 2154.44,
            "end": 2155.43
          },
          {
            "text": "clip",
            "start": 2155.48,
            "end": 2156.47
          },
          {
            "text": "share",
            "start": 2156.52,
            "end": 2157.5
          },
          {
            "text": "and",
            "start": 2157.56,
            "end": 2158.54
          },
          {
            "text": "export",
            "start": 2158.59,
            "end": 2159.58
          },
          {
            "text": "dialogs.",
            "start": 2159.63,
            "end": 2160.61
          },
          {
            "text": "Second,",
            "start": 2160.67,
            "end": 2161.65
          },
          {
            "text": "moving",
            "start": 2161.7,
            "end": 2162.69
          },
          {
            "text": "transcript",
            "start": 2162.74,
            "end": 2163.73
          },
          {
            "text": "search",
            "start": 2163.78,
            "end": 2164.76
          },
          {
            "text": "indexing",
            "start": 2164.81,
            "end": 2165.8
          },
          {
            "text": "into",
            "start": 2165.85,
            "end": 2166.84
          },
          {
            "text": "a",
            "start": 2166.89,
            "end": 2167.87
          },
          {
            "text": "Web",
            "start": 2167.93,
            "end": 2168.91
          },
          {
            "text": "Worker.",
            "start": 2168.96,
            "end": 2169.95
          }
        ]
      },
      {
        "id": "seg-1-079",
        "speakerId": "spk-7",
        "start": 2173,
        "end": 2201,
        "text": "And third, caching pre-rendered summary template outputs at the Cloudflare Edge using stale-while-revalidate headers so page navigation feels instant.",
        "words": [
          {
            "text": "And",
            "start": 2173,
            "end": 2174.4
          },
          {
            "text": "third,",
            "start": 2174.47,
            "end": 2175.87
          },
          {
            "text": "caching",
            "start": 2175.95,
            "end": 2177.35
          },
          {
            "text": "pre-rendered",
            "start": 2177.42,
            "end": 2178.82
          },
          {
            "text": "summary",
            "start": 2178.89,
            "end": 2180.29
          },
          {
            "text": "template",
            "start": 2180.37,
            "end": 2181.77
          },
          {
            "text": "outputs",
            "start": 2181.84,
            "end": 2183.24
          },
          {
            "text": "at",
            "start": 2183.32,
            "end": 2184.72
          },
          {
            "text": "the",
            "start": 2184.79,
            "end": 2186.19
          },
          {
            "text": "Cloudflare",
            "start": 2186.26,
            "end": 2187.66
          },
          {
            "text": "Edge",
            "start": 2187.74,
            "end": 2189.14
          },
          {
            "text": "using",
            "start": 2189.21,
            "end": 2190.61
          },
          {
            "text": "stale-while-revalidate",
            "start": 2190.68,
            "end": 2192.08
          },
          {
            "text": "headers",
            "start": 2192.16,
            "end": 2193.56
          },
          {
            "text": "so",
            "start": 2193.63,
            "end": 2195.03
          },
          {
            "text": "page",
            "start": 2195.11,
            "end": 2196.51
          },
          {
            "text": "navigation",
            "start": 2196.58,
            "end": 2197.98
          },
          {
            "text": "feels",
            "start": 2198.05,
            "end": 2199.45
          },
          {
            "text": "instant.",
            "start": 2199.53,
            "end": 2200.93
          }
        ]
      },
      {
        "id": "seg-1-080",
        "speakerId": "spk-1",
        "start": 2204,
        "end": 2230,
        "text": "Will the client handle optimistic state updates for action items when edge workers are serving cached data?",
        "words": [
          {
            "text": "Will",
            "start": 2204,
            "end": 2205.45
          },
          {
            "text": "the",
            "start": 2205.53,
            "end": 2206.98
          },
          {
            "text": "client",
            "start": 2207.06,
            "end": 2208.51
          },
          {
            "text": "handle",
            "start": 2208.59,
            "end": 2210.04
          },
          {
            "text": "optimistic",
            "start": 2210.12,
            "end": 2211.57
          },
          {
            "text": "state",
            "start": 2211.65,
            "end": 2213.1
          },
          {
            "text": "updates",
            "start": 2213.18,
            "end": 2214.63
          },
          {
            "text": "for",
            "start": 2214.71,
            "end": 2216.16
          },
          {
            "text": "action",
            "start": 2216.24,
            "end": 2217.69
          },
          {
            "text": "items",
            "start": 2217.76,
            "end": 2219.22
          },
          {
            "text": "when",
            "start": 2219.29,
            "end": 2220.75
          },
          {
            "text": "edge",
            "start": 2220.82,
            "end": 2222.28
          },
          {
            "text": "workers",
            "start": 2222.35,
            "end": 2223.81
          },
          {
            "text": "are",
            "start": 2223.88,
            "end": 2225.34
          },
          {
            "text": "serving",
            "start": 2225.41,
            "end": 2226.86
          },
          {
            "text": "cached",
            "start": 2226.94,
            "end": 2228.39
          },
          {
            "text": "data?",
            "start": 2228.47,
            "end": 2229.92
          }
        ]
      },
      {
        "id": "seg-1-081",
        "speakerId": "spk-7",
        "start": 2231,
        "end": 2257,
        "text": "Yes! We use Zustand with local optimistic mutations. When a user checks a todo or creates a highlight, it renders at zero milliseconds while persisting in background.",
        "words": [
          {
            "text": "Yes!",
            "start": 2231,
            "end": 2231.91
          },
          {
            "text": "We",
            "start": 2231.96,
            "end": 2232.88
          },
          {
            "text": "use",
            "start": 2232.93,
            "end": 2233.84
          },
          {
            "text": "Zustand",
            "start": 2233.89,
            "end": 2234.8
          },
          {
            "text": "with",
            "start": 2234.85,
            "end": 2235.77
          },
          {
            "text": "local",
            "start": 2235.81,
            "end": 2236.73
          },
          {
            "text": "optimistic",
            "start": 2236.78,
            "end": 2237.69
          },
          {
            "text": "mutations.",
            "start": 2237.74,
            "end": 2238.66
          },
          {
            "text": "When",
            "start": 2238.7,
            "end": 2239.62
          },
          {
            "text": "a",
            "start": 2239.67,
            "end": 2240.58
          },
          {
            "text": "user",
            "start": 2240.63,
            "end": 2241.54
          },
          {
            "text": "checks",
            "start": 2241.59,
            "end": 2242.51
          },
          {
            "text": "a",
            "start": 2242.56,
            "end": 2243.47
          },
          {
            "text": "todo",
            "start": 2243.52,
            "end": 2244.43
          },
          {
            "text": "or",
            "start": 2244.48,
            "end": 2245.4
          },
          {
            "text": "creates",
            "start": 2245.44,
            "end": 2246.36
          },
          {
            "text": "a",
            "start": 2246.41,
            "end": 2247.32
          },
          {
            "text": "highlight,",
            "start": 2247.37,
            "end": 2248.29
          },
          {
            "text": "it",
            "start": 2248.33,
            "end": 2249.25
          },
          {
            "text": "renders",
            "start": 2249.3,
            "end": 2250.21
          },
          {
            "text": "at",
            "start": 2250.26,
            "end": 2251.17
          },
          {
            "text": "zero",
            "start": 2251.22,
            "end": 2252.14
          },
          {
            "text": "milliseconds",
            "start": 2252.19,
            "end": 2253.1
          },
          {
            "text": "while",
            "start": 2253.15,
            "end": 2254.06
          },
          {
            "text": "persisting",
            "start": 2254.11,
            "end": 2255.03
          },
          {
            "text": "in",
            "start": 2255.07,
            "end": 2255.99
          },
          {
            "text": "background.",
            "start": 2256.04,
            "end": 2256.95
          }
        ]
      },
      {
        "id": "seg-1-082",
        "speakerId": "spk-3",
        "start": 2259,
        "end": 2284,
        "text": "That will make the product feel blazingly fast. Maya, when will that bundle optimization and edge caching be live in staging?",
        "words": [
          {
            "text": "That",
            "start": 2259,
            "end": 2260.13
          },
          {
            "text": "will",
            "start": 2260.19,
            "end": 2261.32
          },
          {
            "text": "make",
            "start": 2261.38,
            "end": 2262.51
          },
          {
            "text": "the",
            "start": 2262.57,
            "end": 2263.7
          },
          {
            "text": "product",
            "start": 2263.76,
            "end": 2264.89
          },
          {
            "text": "feel",
            "start": 2264.95,
            "end": 2266.08
          },
          {
            "text": "blazingly",
            "start": 2266.14,
            "end": 2267.27
          },
          {
            "text": "fast.",
            "start": 2267.33,
            "end": 2268.46
          },
          {
            "text": "Maya,",
            "start": 2268.52,
            "end": 2269.65
          },
          {
            "text": "when",
            "start": 2269.71,
            "end": 2270.85
          },
          {
            "text": "will",
            "start": 2270.9,
            "end": 2272.04
          },
          {
            "text": "that",
            "start": 2272.1,
            "end": 2273.23
          },
          {
            "text": "bundle",
            "start": 2273.29,
            "end": 2274.42
          },
          {
            "text": "optimization",
            "start": 2274.48,
            "end": 2275.61
          },
          {
            "text": "and",
            "start": 2275.67,
            "end": 2276.8
          },
          {
            "text": "edge",
            "start": 2276.86,
            "end": 2277.99
          },
          {
            "text": "caching",
            "start": 2278.05,
            "end": 2279.18
          },
          {
            "text": "be",
            "start": 2279.24,
            "end": 2280.37
          },
          {
            "text": "live",
            "start": 2280.43,
            "end": 2281.56
          },
          {
            "text": "in",
            "start": 2281.62,
            "end": 2282.75
          },
          {
            "text": "staging?",
            "start": 2282.81,
            "end": 2283.94
          }
        ]
      },
      {
        "id": "seg-1-083",
        "speakerId": "spk-7",
        "start": 2287,
        "end": 2312,
        "text": "I will profile our Next.js SSR bundle hydration time and configure edge caching headers by September twenty-fourth. We are aiming for a ninety-five plus Lighthouse score.",
        "words": [
          {
            "text": "I",
            "start": 2287,
            "end": 2287.91
          },
          {
            "text": "will",
            "start": 2287.96,
            "end": 2288.88
          },
          {
            "text": "profile",
            "start": 2288.92,
            "end": 2289.84
          },
          {
            "text": "our",
            "start": 2289.88,
            "end": 2290.8
          },
          {
            "text": "Next.js",
            "start": 2290.85,
            "end": 2291.76
          },
          {
            "text": "SSR",
            "start": 2291.81,
            "end": 2292.72
          },
          {
            "text": "bundle",
            "start": 2292.77,
            "end": 2293.68
          },
          {
            "text": "hydration",
            "start": 2293.73,
            "end": 2294.64
          },
          {
            "text": "time",
            "start": 2294.69,
            "end": 2295.61
          },
          {
            "text": "and",
            "start": 2295.65,
            "end": 2296.57
          },
          {
            "text": "configure",
            "start": 2296.62,
            "end": 2297.53
          },
          {
            "text": "edge",
            "start": 2297.58,
            "end": 2298.49
          },
          {
            "text": "caching",
            "start": 2298.54,
            "end": 2299.45
          },
          {
            "text": "headers",
            "start": 2299.5,
            "end": 2300.41
          },
          {
            "text": "by",
            "start": 2300.46,
            "end": 2301.38
          },
          {
            "text": "September",
            "start": 2301.42,
            "end": 2302.34
          },
          {
            "text": "twenty-fourth.",
            "start": 2302.38,
            "end": 2303.3
          },
          {
            "text": "We",
            "start": 2303.35,
            "end": 2304.26
          },
          {
            "text": "are",
            "start": 2304.31,
            "end": 2305.22
          },
          {
            "text": "aiming",
            "start": 2305.27,
            "end": 2306.18
          },
          {
            "text": "for",
            "start": 2306.23,
            "end": 2307.14
          },
          {
            "text": "a",
            "start": 2307.19,
            "end": 2308.11
          },
          {
            "text": "ninety-five",
            "start": 2308.15,
            "end": 2309.07
          },
          {
            "text": "plus",
            "start": 2309.12,
            "end": 2310.03
          },
          {
            "text": "Lighthouse",
            "start": 2310.08,
            "end": 2310.99
          },
          {
            "text": "score.",
            "start": 2311.04,
            "end": 2311.95
          }
        ]
      },
      {
        "id": "seg-1-084",
        "speakerId": "spk-4",
        "start": 2315,
        "end": 2337,
        "text": "Frontend static assets will also be served with immutable cache headers from our global CDN.",
        "words": [
          {
            "text": "Frontend",
            "start": 2315,
            "end": 2316.39
          },
          {
            "text": "static",
            "start": 2316.47,
            "end": 2317.86
          },
          {
            "text": "assets",
            "start": 2317.93,
            "end": 2319.33
          },
          {
            "text": "will",
            "start": 2319.4,
            "end": 2320.79
          },
          {
            "text": "also",
            "start": 2320.87,
            "end": 2322.26
          },
          {
            "text": "be",
            "start": 2322.33,
            "end": 2323.73
          },
          {
            "text": "served",
            "start": 2323.8,
            "end": 2325.19
          },
          {
            "text": "with",
            "start": 2325.27,
            "end": 2326.66
          },
          {
            "text": "immutable",
            "start": 2326.73,
            "end": 2328.13
          },
          {
            "text": "cache",
            "start": 2328.2,
            "end": 2329.59
          },
          {
            "text": "headers",
            "start": 2329.67,
            "end": 2331.06
          },
          {
            "text": "from",
            "start": 2331.13,
            "end": 2332.53
          },
          {
            "text": "our",
            "start": 2332.6,
            "end": 2333.99
          },
          {
            "text": "global",
            "start": 2334.07,
            "end": 2335.46
          },
          {
            "text": "CDN.",
            "start": 2335.53,
            "end": 2336.93
          }
        ]
      },
      {
        "id": "seg-1-085",
        "speakerId": "spk-8",
        "start": 2340,
        "end": 2365,
        "text": "Finally, let's address governance and compliance. James here. Our annual SOC2 Type II audit window begins next month, and enterprise procurement requires strict proof of compliance.",
        "words": [
          {
            "text": "Finally,",
            "start": 2340,
            "end": 2340.91
          },
          {
            "text": "let's",
            "start": 2340.96,
            "end": 2341.88
          },
          {
            "text": "address",
            "start": 2341.92,
            "end": 2342.84
          },
          {
            "text": "governance",
            "start": 2342.88,
            "end": 2343.8
          },
          {
            "text": "and",
            "start": 2343.85,
            "end": 2344.76
          },
          {
            "text": "compliance.",
            "start": 2344.81,
            "end": 2345.72
          },
          {
            "text": "James",
            "start": 2345.77,
            "end": 2346.68
          },
          {
            "text": "here.",
            "start": 2346.73,
            "end": 2347.64
          },
          {
            "text": "Our",
            "start": 2347.69,
            "end": 2348.61
          },
          {
            "text": "annual",
            "start": 2348.65,
            "end": 2349.57
          },
          {
            "text": "SOC2",
            "start": 2349.62,
            "end": 2350.53
          },
          {
            "text": "Type",
            "start": 2350.58,
            "end": 2351.49
          },
          {
            "text": "II",
            "start": 2351.54,
            "end": 2352.45
          },
          {
            "text": "audit",
            "start": 2352.5,
            "end": 2353.41
          },
          {
            "text": "window",
            "start": 2353.46,
            "end": 2354.38
          },
          {
            "text": "begins",
            "start": 2354.42,
            "end": 2355.34
          },
          {
            "text": "next",
            "start": 2355.38,
            "end": 2356.3
          },
          {
            "text": "month,",
            "start": 2356.35,
            "end": 2357.26
          },
          {
            "text": "and",
            "start": 2357.31,
            "end": 2358.22
          },
          {
            "text": "enterprise",
            "start": 2358.27,
            "end": 2359.18
          },
          {
            "text": "procurement",
            "start": 2359.23,
            "end": 2360.14
          },
          {
            "text": "requires",
            "start": 2360.19,
            "end": 2361.11
          },
          {
            "text": "strict",
            "start": 2361.15,
            "end": 2362.07
          },
          {
            "text": "proof",
            "start": 2362.12,
            "end": 2363.03
          },
          {
            "text": "of",
            "start": 2363.08,
            "end": 2363.99
          },
          {
            "text": "compliance.",
            "start": 2364.04,
            "end": 2364.95
          }
        ]
      },
      {
        "id": "seg-1-086",
        "speakerId": "spk-8",
        "start": 2367,
        "end": 2391,
        "text": "Specifically, all transcript data at rest must use customer-managed KMS encryption keys, and all internal service-to-service gRPC traffic must strictly enforce mutual TLS.",
        "words": [
          {
            "text": "Specifically,",
            "start": 2367,
            "end": 2367.99
          },
          {
            "text": "all",
            "start": 2368.04,
            "end": 2369.03
          },
          {
            "text": "transcript",
            "start": 2369.09,
            "end": 2370.08
          },
          {
            "text": "data",
            "start": 2370.13,
            "end": 2371.12
          },
          {
            "text": "at",
            "start": 2371.17,
            "end": 2372.17
          },
          {
            "text": "rest",
            "start": 2372.22,
            "end": 2373.21
          },
          {
            "text": "must",
            "start": 2373.26,
            "end": 2374.25
          },
          {
            "text": "use",
            "start": 2374.3,
            "end": 2375.3
          },
          {
            "text": "customer-managed",
            "start": 2375.35,
            "end": 2376.34
          },
          {
            "text": "KMS",
            "start": 2376.39,
            "end": 2377.38
          },
          {
            "text": "encryption",
            "start": 2377.43,
            "end": 2378.43
          },
          {
            "text": "keys,",
            "start": 2378.48,
            "end": 2379.47
          },
          {
            "text": "and",
            "start": 2379.52,
            "end": 2380.51
          },
          {
            "text": "all",
            "start": 2380.57,
            "end": 2381.56
          },
          {
            "text": "internal",
            "start": 2381.61,
            "end": 2382.6
          },
          {
            "text": "service-to-service",
            "start": 2382.65,
            "end": 2383.64
          },
          {
            "text": "gRPC",
            "start": 2383.7,
            "end": 2384.69
          },
          {
            "text": "traffic",
            "start": 2384.74,
            "end": 2385.73
          },
          {
            "text": "must",
            "start": 2385.78,
            "end": 2386.77
          },
          {
            "text": "strictly",
            "start": 2386.83,
            "end": 2387.82
          },
          {
            "text": "enforce",
            "start": 2387.87,
            "end": 2388.86
          },
          {
            "text": "mutual",
            "start": 2388.91,
            "end": 2389.9
          },
          {
            "text": "TLS.",
            "start": 2389.96,
            "end": 2390.95
          }
        ]
      },
      {
        "id": "seg-1-087",
        "speakerId": "spk-2",
        "start": 2393,
        "end": 2417,
        "text": "With Marcus's Istio Ambient Mesh work and CockroachDB encryption at rest, we meet all cryptographic requirements. What about key rotation frequency?",
        "words": [
          {
            "text": "With",
            "start": 2393,
            "end": 2394.09
          },
          {
            "text": "Marcus's",
            "start": 2394.14,
            "end": 2395.23
          },
          {
            "text": "Istio",
            "start": 2395.29,
            "end": 2396.37
          },
          {
            "text": "Ambient",
            "start": 2396.43,
            "end": 2397.51
          },
          {
            "text": "Mesh",
            "start": 2397.57,
            "end": 2398.66
          },
          {
            "text": "work",
            "start": 2398.71,
            "end": 2399.8
          },
          {
            "text": "and",
            "start": 2399.86,
            "end": 2400.94
          },
          {
            "text": "CockroachDB",
            "start": 2401,
            "end": 2402.09
          },
          {
            "text": "encryption",
            "start": 2402.14,
            "end": 2403.23
          },
          {
            "text": "at",
            "start": 2403.29,
            "end": 2404.37
          },
          {
            "text": "rest,",
            "start": 2404.43,
            "end": 2405.51
          },
          {
            "text": "we",
            "start": 2405.57,
            "end": 2406.66
          },
          {
            "text": "meet",
            "start": 2406.71,
            "end": 2407.8
          },
          {
            "text": "all",
            "start": 2407.86,
            "end": 2408.94
          },
          {
            "text": "cryptographic",
            "start": 2409,
            "end": 2410.09
          },
          {
            "text": "requirements.",
            "start": 2410.14,
            "end": 2411.23
          },
          {
            "text": "What",
            "start": 2411.29,
            "end": 2412.37
          },
          {
            "text": "about",
            "start": 2412.43,
            "end": 2413.51
          },
          {
            "text": "key",
            "start": 2413.57,
            "end": 2414.66
          },
          {
            "text": "rotation",
            "start": 2414.71,
            "end": 2415.8
          },
          {
            "text": "frequency?",
            "start": 2415.86,
            "end": 2416.94
          }
        ]
      },
      {
        "id": "seg-1-088",
        "speakerId": "spk-8",
        "start": 2419,
        "end": 2442,
        "text": "Customer master keys must rotate automatically every ninety days via AWS KMS with audit event logging streamed directly to CloudTrail.",
        "words": [
          {
            "text": "Customer",
            "start": 2419,
            "end": 2420.09
          },
          {
            "text": "master",
            "start": 2420.15,
            "end": 2421.24
          },
          {
            "text": "keys",
            "start": 2421.3,
            "end": 2422.39
          },
          {
            "text": "must",
            "start": 2422.45,
            "end": 2423.54
          },
          {
            "text": "rotate",
            "start": 2423.6,
            "end": 2424.69
          },
          {
            "text": "automatically",
            "start": 2424.75,
            "end": 2425.84
          },
          {
            "text": "every",
            "start": 2425.9,
            "end": 2426.99
          },
          {
            "text": "ninety",
            "start": 2427.05,
            "end": 2428.14
          },
          {
            "text": "days",
            "start": 2428.2,
            "end": 2429.29
          },
          {
            "text": "via",
            "start": 2429.35,
            "end": 2430.44
          },
          {
            "text": "AWS",
            "start": 2430.5,
            "end": 2431.59
          },
          {
            "text": "KMS",
            "start": 2431.65,
            "end": 2432.74
          },
          {
            "text": "with",
            "start": 2432.8,
            "end": 2433.89
          },
          {
            "text": "audit",
            "start": 2433.95,
            "end": 2435.04
          },
          {
            "text": "event",
            "start": 2435.1,
            "end": 2436.19
          },
          {
            "text": "logging",
            "start": 2436.25,
            "end": 2437.34
          },
          {
            "text": "streamed",
            "start": 2437.4,
            "end": 2438.49
          },
          {
            "text": "directly",
            "start": 2438.55,
            "end": 2439.64
          },
          {
            "text": "to",
            "start": 2439.7,
            "end": 2440.79
          },
          {
            "text": "CloudTrail.",
            "start": 2440.85,
            "end": 2441.94
          }
        ]
      },
      {
        "id": "seg-1-089",
        "speakerId": "spk-8",
        "start": 2445,
        "end": 2467,
        "text": "Every query accessing transcript data or video playback tokens must emit an immutable audit log to our Datadog SIEM within two seconds.",
        "words": [
          {
            "text": "Every",
            "start": 2445,
            "end": 2445.95
          },
          {
            "text": "query",
            "start": 2446,
            "end": 2446.95
          },
          {
            "text": "accessing",
            "start": 2447,
            "end": 2447.95
          },
          {
            "text": "transcript",
            "start": 2448,
            "end": 2448.95
          },
          {
            "text": "data",
            "start": 2449,
            "end": 2449.95
          },
          {
            "text": "or",
            "start": 2450,
            "end": 2450.95
          },
          {
            "text": "video",
            "start": 2451,
            "end": 2451.95
          },
          {
            "text": "playback",
            "start": 2452,
            "end": 2452.95
          },
          {
            "text": "tokens",
            "start": 2453,
            "end": 2453.95
          },
          {
            "text": "must",
            "start": 2454,
            "end": 2454.95
          },
          {
            "text": "emit",
            "start": 2455,
            "end": 2455.95
          },
          {
            "text": "an",
            "start": 2456,
            "end": 2456.95
          },
          {
            "text": "immutable",
            "start": 2457,
            "end": 2457.95
          },
          {
            "text": "audit",
            "start": 2458,
            "end": 2458.95
          },
          {
            "text": "log",
            "start": 2459,
            "end": 2459.95
          },
          {
            "text": "to",
            "start": 2460,
            "end": 2460.95
          },
          {
            "text": "our",
            "start": 2461,
            "end": 2461.95
          },
          {
            "text": "Datadog",
            "start": 2462,
            "end": 2462.95
          },
          {
            "text": "SIEM",
            "start": 2463,
            "end": 2463.95
          },
          {
            "text": "within",
            "start": 2464,
            "end": 2464.95
          },
          {
            "text": "two",
            "start": 2465,
            "end": 2465.95
          },
          {
            "text": "seconds.",
            "start": 2466,
            "end": 2466.95
          }
        ]
      },
      {
        "id": "seg-1-090",
        "speakerId": "spk-8",
        "start": 2470,
        "end": 2493,
        "text": "I will complete our SOC2 Type II compliance gap analysis for zero-trust mTLS proxies and database access by September thirtieth.",
        "words": [
          {
            "text": "I",
            "start": 2470,
            "end": 2471.09
          },
          {
            "text": "will",
            "start": 2471.15,
            "end": 2472.24
          },
          {
            "text": "complete",
            "start": 2472.3,
            "end": 2473.39
          },
          {
            "text": "our",
            "start": 2473.45,
            "end": 2474.54
          },
          {
            "text": "SOC2",
            "start": 2474.6,
            "end": 2475.69
          },
          {
            "text": "Type",
            "start": 2475.75,
            "end": 2476.84
          },
          {
            "text": "II",
            "start": 2476.9,
            "end": 2477.99
          },
          {
            "text": "compliance",
            "start": 2478.05,
            "end": 2479.14
          },
          {
            "text": "gap",
            "start": 2479.2,
            "end": 2480.29
          },
          {
            "text": "analysis",
            "start": 2480.35,
            "end": 2481.44
          },
          {
            "text": "for",
            "start": 2481.5,
            "end": 2482.59
          },
          {
            "text": "zero-trust",
            "start": 2482.65,
            "end": 2483.74
          },
          {
            "text": "mTLS",
            "start": 2483.8,
            "end": 2484.89
          },
          {
            "text": "proxies",
            "start": 2484.95,
            "end": 2486.04
          },
          {
            "text": "and",
            "start": 2486.1,
            "end": 2487.19
          },
          {
            "text": "database",
            "start": 2487.25,
            "end": 2488.34
          },
          {
            "text": "access",
            "start": 2488.4,
            "end": 2489.49
          },
          {
            "text": "by",
            "start": 2489.55,
            "end": 2490.64
          },
          {
            "text": "September",
            "start": 2490.7,
            "end": 2491.79
          },
          {
            "text": "thirtieth.",
            "start": 2491.85,
            "end": 2492.94
          }
        ]
      },
      {
        "id": "seg-1-091",
        "speakerId": "spk-1",
        "start": 2495,
        "end": 2516,
        "text": "Sarah here. I have aligned with all action owners and benchmark timelines. The backend team is ready to execute.",
        "words": [
          {
            "text": "Sarah",
            "start": 2495,
            "end": 2496.05
          },
          {
            "text": "here.",
            "start": 2496.11,
            "end": 2497.16
          },
          {
            "text": "I",
            "start": 2497.21,
            "end": 2498.26
          },
          {
            "text": "have",
            "start": 2498.32,
            "end": 2499.37
          },
          {
            "text": "aligned",
            "start": 2499.42,
            "end": 2500.47
          },
          {
            "text": "with",
            "start": 2500.53,
            "end": 2501.58
          },
          {
            "text": "all",
            "start": 2501.63,
            "end": 2502.68
          },
          {
            "text": "action",
            "start": 2502.74,
            "end": 2503.79
          },
          {
            "text": "owners",
            "start": 2503.84,
            "end": 2504.89
          },
          {
            "text": "and",
            "start": 2504.95,
            "end": 2506
          },
          {
            "text": "benchmark",
            "start": 2506.05,
            "end": 2507.1
          },
          {
            "text": "timelines.",
            "start": 2507.16,
            "end": 2508.21
          },
          {
            "text": "The",
            "start": 2508.26,
            "end": 2509.31
          },
          {
            "text": "backend",
            "start": 2509.37,
            "end": 2510.42
          },
          {
            "text": "team",
            "start": 2510.47,
            "end": 2511.52
          },
          {
            "text": "is",
            "start": 2511.58,
            "end": 2512.63
          },
          {
            "text": "ready",
            "start": 2512.68,
            "end": 2513.73
          },
          {
            "text": "to",
            "start": 2513.79,
            "end": 2514.84
          },
          {
            "text": "execute.",
            "start": 2514.89,
            "end": 2515.94
          }
        ]
      },
      {
        "id": "seg-1-092",
        "speakerId": "spk-3",
        "start": 2519,
        "end": 2535,
        "text": "Outstanding work team. We have clear ownership across all seven critical action items, and consensus on our ninety-nine point nine nine percent availability SLA for Q3. Thank you all.",
        "words": [
          {
            "text": "Outstanding",
            "start": 2519,
            "end": 2519.52
          },
          {
            "text": "work",
            "start": 2519.55,
            "end": 2520.08
          },
          {
            "text": "team.",
            "start": 2520.1,
            "end": 2520.63
          },
          {
            "text": "We",
            "start": 2520.66,
            "end": 2521.18
          },
          {
            "text": "have",
            "start": 2521.21,
            "end": 2521.73
          },
          {
            "text": "clear",
            "start": 2521.76,
            "end": 2522.28
          },
          {
            "text": "ownership",
            "start": 2522.31,
            "end": 2522.83
          },
          {
            "text": "across",
            "start": 2522.86,
            "end": 2523.39
          },
          {
            "text": "all",
            "start": 2523.41,
            "end": 2523.94
          },
          {
            "text": "seven",
            "start": 2523.97,
            "end": 2524.49
          },
          {
            "text": "critical",
            "start": 2524.52,
            "end": 2525.04
          },
          {
            "text": "action",
            "start": 2525.07,
            "end": 2525.59
          },
          {
            "text": "items,",
            "start": 2525.62,
            "end": 2526.14
          },
          {
            "text": "and",
            "start": 2526.17,
            "end": 2526.7
          },
          {
            "text": "consensus",
            "start": 2526.72,
            "end": 2527.25
          },
          {
            "text": "on",
            "start": 2527.28,
            "end": 2527.8
          },
          {
            "text": "our",
            "start": 2527.83,
            "end": 2528.35
          },
          {
            "text": "ninety-nine",
            "start": 2528.38,
            "end": 2528.9
          },
          {
            "text": "point",
            "start": 2528.93,
            "end": 2529.46
          },
          {
            "text": "nine",
            "start": 2529.48,
            "end": 2530.01
          },
          {
            "text": "nine",
            "start": 2530.03,
            "end": 2530.56
          },
          {
            "text": "percent",
            "start": 2530.59,
            "end": 2531.11
          },
          {
            "text": "availability",
            "start": 2531.14,
            "end": 2531.66
          },
          {
            "text": "SLA",
            "start": 2531.69,
            "end": 2532.21
          },
          {
            "text": "for",
            "start": 2532.24,
            "end": 2532.77
          },
          {
            "text": "Q3.",
            "start": 2532.79,
            "end": 2533.32
          },
          {
            "text": "Thank",
            "start": 2533.34,
            "end": 2533.87
          },
          {
            "text": "you",
            "start": 2533.9,
            "end": 2534.42
          },
          {
            "text": "all.",
            "start": 2534.45,
            "end": 2534.97
          }
        ]
      }
    ],
    "highlights": [
      {
        "id": "hl-1-1",
        "meetingId": "meeting-1",
        "title": "Latency Spike Root Cause in Connection Pooler",
        "start": 380,
        "end": 440,
        "category": "key_moment",
        "color": "#3B82F6",
        "createdAt": "2026-09-12T14:07:00.000Z"
      },
      {
        "id": "hl-1-2",
        "meetingId": "meeting-1",
        "title": "Decision to Standardize on CockroachDB Multi-Region",
        "start": 830,
        "end": 910,
        "category": "decision",
        "color": "#8B5CF6",
        "createdAt": "2026-09-12T14:14:30.000Z"
      },
      {
        "id": "hl-1-3",
        "meetingId": "meeting-1",
        "title": "Istio Ambient Mesh Canary Deployment Approval",
        "start": 1200,
        "end": 1260,
        "category": "action",
        "color": "#10B981",
        "createdAt": "2026-09-12T14:20:45.000Z"
      },
      {
        "id": "hl-1-4",
        "meetingId": "meeting-1",
        "title": "Staging Failover 45s Delay Discovered",
        "start": 1540,
        "end": 1610,
        "category": "risk",
        "color": "#EF4444",
        "createdAt": "2026-09-12T14:26:10.000Z"
      },
      {
        "id": "hl-1-5",
        "meetingId": "meeting-1",
        "title": "Final Consensus on Q3 99.99% Availability SLA",
        "start": 2470,
        "end": 2525,
        "category": "key_moment",
        "color": "#3B82F6",
        "createdAt": "2026-09-12T14:41:40.000Z"
      }
    ],
    "actionItems": [
      {
        "id": "act-1-1",
        "meetingId": "meeting-1",
        "meetingTitle": "Q3 Platform Architecture & Scalability Sync",
        "text": "Run load testing benchmark on Redis cluster with 50k RPS target and monitor p99 latency",
        "assigneeId": "spk-1",
        "completed": false,
        "timestamp": 480,
        "priority": "high",
        "dueDate": "2026-09-20"
      },
      {
        "id": "act-1-2",
        "meetingId": "meeting-1",
        "meetingTitle": "Q3 Platform Architecture & Scalability Sync",
        "text": "Draft RFC for multi-region active-active CockroachDB migration strategy",
        "assigneeId": "spk-2",
        "completed": true,
        "timestamp": 830,
        "priority": "high",
        "dueDate": "2026-09-22"
      },
      {
        "id": "act-1-3",
        "meetingId": "meeting-1",
        "meetingTitle": "Q3 Platform Architecture & Scalability Sync",
        "text": "Implement Istio ambient mesh canary deployment pipeline in staging environment",
        "assigneeId": "spk-4",
        "completed": false,
        "timestamp": 1220,
        "priority": "medium",
        "dueDate": "2026-09-25"
      },
      {
        "id": "act-1-4",
        "meetingId": "meeting-1",
        "meetingTitle": "Q3 Platform Architecture & Scalability Sync",
        "text": "Create automated chaos engineering test suite for cross-AZ partition tolerance",
        "assigneeId": "spk-5",
        "completed": false,
        "timestamp": 1540,
        "priority": "medium",
        "dueDate": "2026-09-28"
      },
      {
        "id": "act-1-5",
        "meetingId": "meeting-1",
        "meetingTitle": "Q3 Platform Architecture & Scalability Sync",
        "text": "Audit Kafka consumer group lag and tune partition rebalancing timeouts",
        "assigneeId": "spk-6",
        "completed": false,
        "timestamp": 1890,
        "priority": "medium",
        "dueDate": "2026-09-21"
      },
      {
        "id": "act-1-6",
        "meetingId": "meeting-1",
        "meetingTitle": "Q3 Platform Architecture & Scalability Sync",
        "text": "Profile Next.js SSR bundle hydration time and add edge caching headers",
        "assigneeId": "spk-7",
        "completed": true,
        "timestamp": 2145,
        "priority": "low",
        "dueDate": "2026-09-24"
      },
      {
        "id": "act-1-7",
        "meetingId": "meeting-1",
        "meetingTitle": "Q3 Platform Architecture & Scalability Sync",
        "text": "Complete SOC2 Type II compliance gap analysis for zero-trust mTLS proxies",
        "assigneeId": "spk-8",
        "completed": false,
        "timestamp": 2380,
        "priority": "high",
        "dueDate": "2026-09-30"
      }
    ],
    "summaries": {
      "executive": {
        "id": "executive",
        "name": "Executive Summary",
        "icon": "Briefcase",
        "overview": "The platform engineering and product leadership convened for a 42-minute architecture review to establish concrete technical workstreams for elevating platform availability from 99.9% to 99.99% (four nines). The discussion centered on resolving tail-latency spikes observed during peak enterprise traffic, migrating from single-region Aurora PostgreSQL to active-active CockroachDB, replacing sidecar service mesh with Istio Ambient Mesh, and hardening Kafka event ingestion against split-brain failover delays.",
        "sections": [
          {
            "title": "Platform Availability & SLA Target",
            "bullets": [
              "Set company-wide commitment to achieve 99.99% uptime availability for Q3 across all core transcription and playback APIs.",
              "Identified root cause of previous p99 latency degradation (45ms spiking to 820ms) as database socket exhaustion during pod autoscaling events.",
              "Established automated error budget tracking with k6 synthetic load benchmarks running in CI/CD."
            ],
            "timestampRefs": [
              {
                "text": "SLA target introduction",
                "time": 24
              },
              {
                "text": "Root cause analysis",
                "time": 356
              }
            ]
          },
          {
            "title": "Database Scaling & Multi-Region Strategy",
            "bullets": [
              "Immediate mitigation: Deploy AWS RDS Proxy with transaction-level connection pooling and offload presence heartbeats to a 3-shard Redis Cluster.",
              "Strategic architecture: Standardize on multi-region active-active CockroachDB v24 across us-east, us-west, and eu-central to eliminate single-region failover vulnerability.",
              "Raft-based range leaseholder localization guarantees localized write latencies within 18ms and follower reads under 5ms."
            ],
            "timestampRefs": [
              {
                "text": "Redis cluster 50k RPS load test",
                "time": 475
              },
              {
                "text": "CockroachDB multi-region RFC greenlight",
                "time": 800
              }
            ]
          },
          {
            "title": "Service Mesh, Chaos Engineering & Resiliency",
            "bullets": [
              "Migrating from legacy Envoy sidecars to Istio Ambient Mesh with kernel-level eBPF ztunnel proxies, reducing memory by 60% and cutting 4ms proxy overhead.",
              "Elena and QA team will establish an automated Chaos Mesh test suite in staging simulating cross-AZ packet loss and leader termination.",
              "Enforce mandatory build failure in CI/CD if failover recovery times exceed 5 seconds."
            ],
            "timestampRefs": [
              {
                "text": "Istio Ambient Mesh proposal",
                "time": 1198
              },
              {
                "text": "Staging partition tolerance delay",
                "time": 1540
              }
            ]
          },
          {
            "title": "Security, Governance & Frontend Hydration",
            "bullets": [
              "Kafka event pipeline upgraded to cooperative sticky rebalancing with composite meeting+speaker partition keys to eliminate ingestion freezes.",
              "Next.js meeting detail bundle optimized with Web Worker search indexing and Cloudflare Edge template caching to achieve 95+ Lighthouse score.",
              "Full compliance readiness for annual SOC2 Type II audit with KMS key rotation and mTLS SPIFFE workload identities."
            ],
            "timestampRefs": [
              {
                "text": "Kafka partition key re-hashing",
                "time": 2035
              },
              {
                "text": "Next.js SSR edge caching",
                "time": 2345
              },
              {
                "text": "SOC2 Type II compliance audit",
                "time": 2554
              }
            ]
          }
        ]
      },
      "action_items": {
        "id": "action_items",
        "name": "Action Items & Next Steps",
        "icon": "CheckSquare",
        "overview": "Seven concrete, time-bound deliverables assigned to lead architects and engineers with specific verification criteria for Q3 platform reliability.",
        "sections": [
          {
            "title": "Core Infrastructure & Database Workstreams",
            "bullets": [
              "Sarah Chen: Run load testing benchmark on Redis cluster with 50k RPS target and monitor p99 latency (Due: Sep 20).",
              "Alex Rivera: Draft RFC for multi-region active-active CockroachDB migration strategy including GDPR data residency partitioning (Due: Sep 22).",
              "David Kim: Audit Kafka consumer group lag, implement composite partition keys, and configure dead-letter queues (Due: Sep 21)."
            ],
            "timestampRefs": [
              {
                "text": "Sarah Chen commitment",
                "time": 618
              },
              {
                "text": "Alex Rivera RFC timeline",
                "time": 896
              },
              {
                "text": "David Kim Kafka audit",
                "time": 2128
              }
            ]
          },
          {
            "title": "DevOps, SRE & Chaos Automation",
            "bullets": [
              "Marcus Brody: Implement Istio ambient mesh canary deployment pipeline in staging environment using Argo Rollouts (Due: Sep 25).",
              "Elena Rostova: Create automated chaos engineering test suite with Chaos Mesh testing cross-AZ partition tolerance and DNS propagation (Due: Sep 28)."
            ],
            "timestampRefs": [
              {
                "text": "Marcus Brody canary pipeline",
                "time": 1445
              },
              {
                "text": "Elena Rostova chaos test suite",
                "time": 1785
              }
            ]
          },
          {
            "title": "Frontend Experience & Security Governance",
            "bullets": [
              "Maya Lin: Profile Next.js SSR bundle hydration time and add edge caching headers for 95+ Lighthouse score (Due: Sep 24).",
              "James Wilson: Complete SOC2 Type II compliance gap analysis for zero-trust mTLS proxies and KMS customer key rotation (Due: Sep 30)."
            ],
            "timestampRefs": [
              {
                "text": "Maya Lin bundle profile",
                "time": 2468
              },
              {
                "text": "James Wilson SOC2 gap analysis",
                "time": 2665
              }
            ]
          }
        ]
      },
      "sales": {
        "id": "sales",
        "name": "Sales & Customer Impact",
        "icon": "TrendingUp",
        "overview": "Key technical investments that directly bolster enterprise sales positioning, competitive win rates against legacy meeting notetakers, and contractual SLA commitments.",
        "sections": [
          {
            "title": "Enterprise SLA Guarantees (99.99% Availability)",
            "bullets": [
              "Commercial sales teams can confidently offer 99.99% contractual uptime guarantees with financial penalty backing for tier-one accounts.",
              "Active-active multi-region redundancy eliminates regional cloud provider downtime as a risk factor during enterprise RFP reviews."
            ],
            "timestampRefs": [
              {
                "text": "Four-nines availability target",
                "time": 24
              }
            ]
          },
          {
            "title": "Global Performance & EU Data Residency",
            "bullets": [
              "Sub-20ms transcript loading latency globally via Cloudflare Edge workers and follower reads across Frankfurt, Oregon, and Virginia.",
              "Native CockroachDB data partitioning enables airtight GDPR compliance by anchoring European customer recordings exclusively within EU borders."
            ],
            "timestampRefs": [
              {
                "text": "GDPR regional partitioning",
                "time": 1076
              },
              {
                "text": "Global edge caching latency",
                "time": 2345
              }
            ]
          },
          {
            "title": "Security & Compliance Assurance for Enterprise Procurement",
            "bullets": [
              "Zero-trust mTLS encryption across all internal microservices satisfies stringent security questionnaires from Fortune 500 CISOs.",
              "Dedicated customer-managed KMS encryption keys and real-time immutable audit logs accelerate legal and procurement cycles."
            ],
            "timestampRefs": [
              {
                "text": "SOC2 compliance criteria",
                "time": 2554
              }
            ]
          }
        ]
      },
      "engineering": {
        "id": "engineering",
        "name": "Engineering & Architecture Notes",
        "icon": "Cpu",
        "overview": "Comprehensive deep-dive architectural specifications, protocol choices, and distributed systems invariants agreed upon by the engineering council.",
        "sections": [
          {
            "title": "Distributed Storage & Transactional Consistency",
            "bullets": [
              "CockroachDB v24 selected for multi-master active-active replication using Multi-Raft consensus across availability zones.",
              "Range leaseholders localized per organization ID to ensure single-region write speeds (<18ms) without cross-continental WAN roundtrips.",
              "Online schema migrations execute via asynchronous MVCC state transitions without table locks."
            ],
            "timestampRefs": [
              {
                "text": "Raft range leases",
                "time": 800
              },
              {
                "text": "Zero-downtime DDL",
                "time": 1018
              }
            ]
          },
          {
            "title": "Service Mesh Architecture: Istio Ambient Mode",
            "bullets": [
              "Transitioning from sidecar injection to Ambient Mesh eBPF ztunnel daemonsets on Kubernetes worker nodes.",
              "L4 traffic encrypted over HBONE (HTTP-Based Overlay Network Environment) mTLS tunnels with cryptographic SPIFFE identities.",
              "L7 traffic management and progressive canary routing delegated to Istio Waypoint proxies paired with Argo Rollouts."
            ],
            "timestampRefs": [
              {
                "text": "Ambient mesh eBPF ztunnel",
                "time": 1198
              },
              {
                "text": "Waypoint proxy L7 routing",
                "time": 1322
              }
            ]
          },
          {
            "title": "Streaming Event Pipeline & Resiliency Invariants",
            "bullets": [
              "Kafka consumer groups upgraded to incremental cooperative rebalancing with session timeout tuned to 800ms.",
              "Partition key re-hashed from pure meetingId to composite `hash(meetingId + speakerId)` across 24 partitions.",
              "Poison-pill mitigation: Dead-letter queue (DLQ) with exponential backoff and 3-attempt ceiling before quarantine."
            ],
            "timestampRefs": [
              {
                "text": "Kafka consumer group tuning",
                "time": 1940
              },
              {
                "text": "Dead letter queue pattern",
                "time": 2098
              }
            ]
          },
          {
            "title": "Client-Side Hydration & Edge Worker Optimization",
            "bullets": [
              "Next.js App Router bundle reduced by code-splitting heavy modals and moving transcript search indexing into a dedicated Web Worker.",
              "Pre-computed template summaries and initial transcript segments cached at Cloudflare Edge with `stale-while-revalidate` directives.",
              "Client state management powered by Zustand with optimistic UI mutations and local storage persistence."
            ],
            "timestampRefs": [
              {
                "text": "Web Worker search indexing",
                "time": 2312
              },
              {
                "text": "Optimistic UI in Zustand",
                "time": 2408
              }
            ]
          }
        ]
      }
    },
    "tags": [
      "Engineering",
      "Architecture",
      "Scalability",
      "Q3",
      "Kubernetes"
    ]
  },
  {
    "id": "meeting-2",
    "title": "Acme Corp <> Fathom Enterprise Evaluation",
    "date": "2026-09-11T16:30:00.000Z",
    "duration": 1720,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "participants": [
      {
        "id": "spk-s1",
        "name": "Jordan Lee",
        "role": "Senior Enterprise Account Executive",
        "company": "Fathom",
        "color": "#6366F1",
        "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-s2",
        "name": "Rachel Martinez",
        "role": "Lead Solutions Architect",
        "company": "Fathom",
        "color": "#10B981",
        "avatarUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-s3",
        "name": "Thomas Wright",
        "role": "VP of Engineering",
        "company": "Acme Corp",
        "color": "#3B82F6",
        "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-s4",
        "name": "Samantha Vance",
        "role": "Director of InfoSec & Compliance",
        "company": "Acme Corp",
        "color": "#EC4899",
        "avatarUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
      }
    ],
    "transcript": [
      {
        "id": "seg-2-001",
        "speakerId": "spk-s1",
        "start": 0,
        "end": 35,
        "text": "Welcome Thomas and Samantha! Jordan here from Fathom alongside Rachel, our Lead Solutions Architect. We are thrilled to host Acme Corp today.",
        "words": [
          {
            "text": "Welcome",
            "start": 0,
            "end": 1.51
          },
          {
            "text": "Thomas",
            "start": 1.59,
            "end": 3.1
          },
          {
            "text": "and",
            "start": 3.18,
            "end": 4.69
          },
          {
            "text": "Samantha!",
            "start": 4.77,
            "end": 6.28
          },
          {
            "text": "Jordan",
            "start": 6.36,
            "end": 7.88
          },
          {
            "text": "here",
            "start": 7.95,
            "end": 9.47
          },
          {
            "text": "from",
            "start": 9.55,
            "end": 11.06
          },
          {
            "text": "Fathom",
            "start": 11.14,
            "end": 12.65
          },
          {
            "text": "alongside",
            "start": 12.73,
            "end": 14.24
          },
          {
            "text": "Rachel,",
            "start": 14.32,
            "end": 15.83
          },
          {
            "text": "our",
            "start": 15.91,
            "end": 17.42
          },
          {
            "text": "Lead",
            "start": 17.5,
            "end": 19.01
          },
          {
            "text": "Solutions",
            "start": 19.09,
            "end": 20.6
          },
          {
            "text": "Architect.",
            "start": 20.68,
            "end": 22.19
          },
          {
            "text": "We",
            "start": 22.27,
            "end": 23.78
          },
          {
            "text": "are",
            "start": 23.86,
            "end": 25.38
          },
          {
            "text": "thrilled",
            "start": 25.45,
            "end": 26.97
          },
          {
            "text": "to",
            "start": 27.05,
            "end": 28.56
          },
          {
            "text": "host",
            "start": 28.64,
            "end": 30.15
          },
          {
            "text": "Acme",
            "start": 30.23,
            "end": 31.74
          },
          {
            "text": "Corp",
            "start": 31.82,
            "end": 33.33
          },
          {
            "text": "today.",
            "start": 33.41,
            "end": 34.92
          }
        ]
      },
      {
        "id": "seg-2-002",
        "speakerId": "spk-s3",
        "start": 38,
        "end": 75,
        "text": "Thanks Jordan. Acme currently has over four hundred engineering managers and product leads struggling with meeting documentation overhead across Zoom and Google Meet.",
        "words": [
          {
            "text": "Thanks",
            "start": 38,
            "end": 39.53
          },
          {
            "text": "Jordan.",
            "start": 39.61,
            "end": 41.14
          },
          {
            "text": "Acme",
            "start": 41.22,
            "end": 42.75
          },
          {
            "text": "currently",
            "start": 42.83,
            "end": 44.35
          },
          {
            "text": "has",
            "start": 44.43,
            "end": 45.96
          },
          {
            "text": "over",
            "start": 46.04,
            "end": 47.57
          },
          {
            "text": "four",
            "start": 47.65,
            "end": 49.18
          },
          {
            "text": "hundred",
            "start": 49.26,
            "end": 50.79
          },
          {
            "text": "engineering",
            "start": 50.87,
            "end": 52.4
          },
          {
            "text": "managers",
            "start": 52.48,
            "end": 54.01
          },
          {
            "text": "and",
            "start": 54.09,
            "end": 55.62
          },
          {
            "text": "product",
            "start": 55.7,
            "end": 57.22
          },
          {
            "text": "leads",
            "start": 57.3,
            "end": 58.83
          },
          {
            "text": "struggling",
            "start": 58.91,
            "end": 60.44
          },
          {
            "text": "with",
            "start": 60.52,
            "end": 62.05
          },
          {
            "text": "meeting",
            "start": 62.13,
            "end": 63.66
          },
          {
            "text": "documentation",
            "start": 63.74,
            "end": 65.27
          },
          {
            "text": "overhead",
            "start": 65.35,
            "end": 66.88
          },
          {
            "text": "across",
            "start": 66.96,
            "end": 68.48
          },
          {
            "text": "Zoom",
            "start": 68.57,
            "end": 70.09
          },
          {
            "text": "and",
            "start": 70.17,
            "end": 71.7
          },
          {
            "text": "Google",
            "start": 71.78,
            "end": 73.31
          },
          {
            "text": "Meet.",
            "start": 73.39,
            "end": 74.92
          }
        ]
      },
      {
        "id": "seg-2-003",
        "speakerId": "spk-s3",
        "start": 78,
        "end": 115,
        "text": "Our team is spending roughly twelve hours per week manually writing meeting minutes, drafting follow-ups, and chasing down ticket updates.",
        "words": [
          {
            "text": "Our",
            "start": 78,
            "end": 79.76
          },
          {
            "text": "team",
            "start": 79.85,
            "end": 81.61
          },
          {
            "text": "is",
            "start": 81.7,
            "end": 83.46
          },
          {
            "text": "spending",
            "start": 83.55,
            "end": 85.31
          },
          {
            "text": "roughly",
            "start": 85.4,
            "end": 87.16
          },
          {
            "text": "twelve",
            "start": 87.25,
            "end": 89.01
          },
          {
            "text": "hours",
            "start": 89.1,
            "end": 90.86
          },
          {
            "text": "per",
            "start": 90.95,
            "end": 92.71
          },
          {
            "text": "week",
            "start": 92.8,
            "end": 94.56
          },
          {
            "text": "manually",
            "start": 94.65,
            "end": 96.41
          },
          {
            "text": "writing",
            "start": 96.5,
            "end": 98.26
          },
          {
            "text": "meeting",
            "start": 98.35,
            "end": 100.11
          },
          {
            "text": "minutes,",
            "start": 100.2,
            "end": 101.96
          },
          {
            "text": "drafting",
            "start": 102.05,
            "end": 103.81
          },
          {
            "text": "follow-ups,",
            "start": 103.9,
            "end": 105.66
          },
          {
            "text": "and",
            "start": 105.75,
            "end": 107.51
          },
          {
            "text": "chasing",
            "start": 107.6,
            "end": 109.36
          },
          {
            "text": "down",
            "start": 109.45,
            "end": 111.21
          },
          {
            "text": "ticket",
            "start": 111.3,
            "end": 113.06
          },
          {
            "text": "updates.",
            "start": 113.15,
            "end": 114.91
          }
        ]
      },
      {
        "id": "seg-2-004",
        "speakerId": "spk-s1",
        "start": 118,
        "end": 155,
        "text": "That is a classic challenge we solve for enterprise engineering organizations. Our customers typically see an eighty percent reduction in manual note-taking time.",
        "words": [
          {
            "text": "That",
            "start": 118,
            "end": 119.53
          },
          {
            "text": "is",
            "start": 119.61,
            "end": 121.14
          },
          {
            "text": "a",
            "start": 121.22,
            "end": 122.75
          },
          {
            "text": "classic",
            "start": 122.83,
            "end": 124.35
          },
          {
            "text": "challenge",
            "start": 124.43,
            "end": 125.96
          },
          {
            "text": "we",
            "start": 126.04,
            "end": 127.57
          },
          {
            "text": "solve",
            "start": 127.65,
            "end": 129.18
          },
          {
            "text": "for",
            "start": 129.26,
            "end": 130.79
          },
          {
            "text": "enterprise",
            "start": 130.87,
            "end": 132.4
          },
          {
            "text": "engineering",
            "start": 132.48,
            "end": 134.01
          },
          {
            "text": "organizations.",
            "start": 134.09,
            "end": 135.62
          },
          {
            "text": "Our",
            "start": 135.7,
            "end": 137.22
          },
          {
            "text": "customers",
            "start": 137.3,
            "end": 138.83
          },
          {
            "text": "typically",
            "start": 138.91,
            "end": 140.44
          },
          {
            "text": "see",
            "start": 140.52,
            "end": 142.05
          },
          {
            "text": "an",
            "start": 142.13,
            "end": 143.66
          },
          {
            "text": "eighty",
            "start": 143.74,
            "end": 145.27
          },
          {
            "text": "percent",
            "start": 145.35,
            "end": 146.88
          },
          {
            "text": "reduction",
            "start": 146.96,
            "end": 148.48
          },
          {
            "text": "in",
            "start": 148.57,
            "end": 150.09
          },
          {
            "text": "manual",
            "start": 150.17,
            "end": 151.7
          },
          {
            "text": "note-taking",
            "start": 151.78,
            "end": 153.31
          },
          {
            "text": "time.",
            "start": 153.39,
            "end": 154.92
          }
        ]
      },
      {
        "id": "seg-2-005",
        "speakerId": "spk-s2",
        "start": 158,
        "end": 205,
        "text": "Rachel here. Fathom operates with sub-second diarization, dynamic AI templates tailored for engineering, sales, and executive syncs, and an automated Action Items engine.",
        "words": [
          {
            "text": "Rachel",
            "start": 158,
            "end": 159.94
          },
          {
            "text": "here.",
            "start": 160.04,
            "end": 161.98
          },
          {
            "text": "Fathom",
            "start": 162.09,
            "end": 164.03
          },
          {
            "text": "operates",
            "start": 164.13,
            "end": 166.07
          },
          {
            "text": "with",
            "start": 166.17,
            "end": 168.12
          },
          {
            "text": "sub-second",
            "start": 168.22,
            "end": 170.16
          },
          {
            "text": "diarization,",
            "start": 170.26,
            "end": 172.2
          },
          {
            "text": "dynamic",
            "start": 172.3,
            "end": 174.25
          },
          {
            "text": "AI",
            "start": 174.35,
            "end": 176.29
          },
          {
            "text": "templates",
            "start": 176.39,
            "end": 178.33
          },
          {
            "text": "tailored",
            "start": 178.43,
            "end": 180.38
          },
          {
            "text": "for",
            "start": 180.48,
            "end": 182.42
          },
          {
            "text": "engineering,",
            "start": 182.52,
            "end": 184.46
          },
          {
            "text": "sales,",
            "start": 184.57,
            "end": 186.51
          },
          {
            "text": "and",
            "start": 186.61,
            "end": 188.55
          },
          {
            "text": "executive",
            "start": 188.65,
            "end": 190.59
          },
          {
            "text": "syncs,",
            "start": 190.7,
            "end": 192.64
          },
          {
            "text": "and",
            "start": 192.74,
            "end": 194.68
          },
          {
            "text": "an",
            "start": 194.78,
            "end": 196.72
          },
          {
            "text": "automated",
            "start": 196.83,
            "end": 198.77
          },
          {
            "text": "Action",
            "start": 198.87,
            "end": 200.81
          },
          {
            "text": "Items",
            "start": 200.91,
            "end": 202.85
          },
          {
            "text": "engine.",
            "start": 202.96,
            "end": 204.9
          }
        ]
      },
      {
        "id": "seg-2-006",
        "speakerId": "spk-s4",
        "start": 208,
        "end": 255,
        "text": "Samantha here from InfoSec. Before we evaluate features, security is non-negotiable for Acme. Does Fathom train LLM models on our proprietary customer data or transcripts?",
        "words": [
          {
            "text": "Samantha",
            "start": 208,
            "end": 209.79
          },
          {
            "text": "here",
            "start": 209.88,
            "end": 211.67
          },
          {
            "text": "from",
            "start": 211.76,
            "end": 213.55
          },
          {
            "text": "InfoSec.",
            "start": 213.64,
            "end": 215.43
          },
          {
            "text": "Before",
            "start": 215.52,
            "end": 217.31
          },
          {
            "text": "we",
            "start": 217.4,
            "end": 219.19
          },
          {
            "text": "evaluate",
            "start": 219.28,
            "end": 221.07
          },
          {
            "text": "features,",
            "start": 221.16,
            "end": 222.95
          },
          {
            "text": "security",
            "start": 223.04,
            "end": 224.83
          },
          {
            "text": "is",
            "start": 224.92,
            "end": 226.71
          },
          {
            "text": "non-negotiable",
            "start": 226.8,
            "end": 228.59
          },
          {
            "text": "for",
            "start": 228.68,
            "end": 230.47
          },
          {
            "text": "Acme.",
            "start": 230.56,
            "end": 232.35
          },
          {
            "text": "Does",
            "start": 232.44,
            "end": 234.23
          },
          {
            "text": "Fathom",
            "start": 234.32,
            "end": 236.11
          },
          {
            "text": "train",
            "start": 236.2,
            "end": 237.99
          },
          {
            "text": "LLM",
            "start": 238.08,
            "end": 239.87
          },
          {
            "text": "models",
            "start": 239.96,
            "end": 241.75
          },
          {
            "text": "on",
            "start": 241.84,
            "end": 243.63
          },
          {
            "text": "our",
            "start": 243.72,
            "end": 245.51
          },
          {
            "text": "proprietary",
            "start": 245.6,
            "end": 247.39
          },
          {
            "text": "customer",
            "start": 247.48,
            "end": 249.27
          },
          {
            "text": "data",
            "start": 249.36,
            "end": 251.15
          },
          {
            "text": "or",
            "start": 251.24,
            "end": 253.03
          },
          {
            "text": "transcripts?",
            "start": 253.12,
            "end": 254.91
          }
        ]
      },
      {
        "id": "seg-2-007",
        "speakerId": "spk-s2",
        "start": 258,
        "end": 310,
        "text": "Absolutely not Samantha. Fathom has a strict zero-data-retention agreement with our LLM providers. Customer transcripts are never used for model training or fine-tuning.",
        "words": [
          {
            "text": "Absolutely",
            "start": 258,
            "end": 260.15
          },
          {
            "text": "not",
            "start": 260.26,
            "end": 262.41
          },
          {
            "text": "Samantha.",
            "start": 262.52,
            "end": 264.67
          },
          {
            "text": "Fathom",
            "start": 264.78,
            "end": 266.93
          },
          {
            "text": "has",
            "start": 267.04,
            "end": 269.19
          },
          {
            "text": "a",
            "start": 269.3,
            "end": 271.45
          },
          {
            "text": "strict",
            "start": 271.57,
            "end": 273.71
          },
          {
            "text": "zero-data-retention",
            "start": 273.83,
            "end": 275.97
          },
          {
            "text": "agreement",
            "start": 276.09,
            "end": 278.23
          },
          {
            "text": "with",
            "start": 278.35,
            "end": 280.5
          },
          {
            "text": "our",
            "start": 280.61,
            "end": 282.76
          },
          {
            "text": "LLM",
            "start": 282.87,
            "end": 285.02
          },
          {
            "text": "providers.",
            "start": 285.13,
            "end": 287.28
          },
          {
            "text": "Customer",
            "start": 287.39,
            "end": 289.54
          },
          {
            "text": "transcripts",
            "start": 289.65,
            "end": 291.8
          },
          {
            "text": "are",
            "start": 291.91,
            "end": 294.06
          },
          {
            "text": "never",
            "start": 294.17,
            "end": 296.32
          },
          {
            "text": "used",
            "start": 296.43,
            "end": 298.58
          },
          {
            "text": "for",
            "start": 298.7,
            "end": 300.84
          },
          {
            "text": "model",
            "start": 300.96,
            "end": 303.1
          },
          {
            "text": "training",
            "start": 303.22,
            "end": 305.37
          },
          {
            "text": "or",
            "start": 305.48,
            "end": 307.63
          },
          {
            "text": "fine-tuning.",
            "start": 307.74,
            "end": 309.89
          }
        ]
      },
      {
        "id": "seg-2-008",
        "speakerId": "spk-s4",
        "start": 314,
        "end": 365,
        "text": "What about data encryption and single sign-on? We require Okta SAML 2.0 with SCIM automated user provisioning and SOC2 Type II certification.",
        "words": [
          {
            "text": "What",
            "start": 314,
            "end": 316.2
          },
          {
            "text": "about",
            "start": 316.32,
            "end": 318.52
          },
          {
            "text": "data",
            "start": 318.64,
            "end": 320.84
          },
          {
            "text": "encryption",
            "start": 320.95,
            "end": 323.16
          },
          {
            "text": "and",
            "start": 323.27,
            "end": 325.48
          },
          {
            "text": "single",
            "start": 325.59,
            "end": 327.79
          },
          {
            "text": "sign-on?",
            "start": 327.91,
            "end": 330.11
          },
          {
            "text": "We",
            "start": 330.23,
            "end": 332.43
          },
          {
            "text": "require",
            "start": 332.55,
            "end": 334.75
          },
          {
            "text": "Okta",
            "start": 334.86,
            "end": 337.07
          },
          {
            "text": "SAML",
            "start": 337.18,
            "end": 339.38
          },
          {
            "text": "2.0",
            "start": 339.5,
            "end": 341.7
          },
          {
            "text": "with",
            "start": 341.82,
            "end": 344.02
          },
          {
            "text": "SCIM",
            "start": 344.14,
            "end": 346.34
          },
          {
            "text": "automated",
            "start": 346.45,
            "end": 348.66
          },
          {
            "text": "user",
            "start": 348.77,
            "end": 350.98
          },
          {
            "text": "provisioning",
            "start": 351.09,
            "end": 353.29
          },
          {
            "text": "and",
            "start": 353.41,
            "end": 355.61
          },
          {
            "text": "SOC2",
            "start": 355.73,
            "end": 357.93
          },
          {
            "text": "Type",
            "start": 358.05,
            "end": 360.25
          },
          {
            "text": "II",
            "start": 360.36,
            "end": 362.57
          },
          {
            "text": "certification.",
            "start": 362.68,
            "end": 364.88
          }
        ]
      },
      {
        "id": "seg-2-009",
        "speakerId": "spk-s2",
        "start": 368,
        "end": 420,
        "text": "We natively support Okta, Azure AD, and Google Workspace SAML 2.0 with just-in-time and SCIM provisioning, along with end-to-end AES-256 encryption at rest.",
        "words": [
          {
            "text": "We",
            "start": 368,
            "end": 370.15
          },
          {
            "text": "natively",
            "start": 370.26,
            "end": 372.41
          },
          {
            "text": "support",
            "start": 372.52,
            "end": 374.67
          },
          {
            "text": "Okta,",
            "start": 374.78,
            "end": 376.93
          },
          {
            "text": "Azure",
            "start": 377.04,
            "end": 379.19
          },
          {
            "text": "AD,",
            "start": 379.3,
            "end": 381.45
          },
          {
            "text": "and",
            "start": 381.57,
            "end": 383.71
          },
          {
            "text": "Google",
            "start": 383.83,
            "end": 385.97
          },
          {
            "text": "Workspace",
            "start": 386.09,
            "end": 388.23
          },
          {
            "text": "SAML",
            "start": 388.35,
            "end": 390.5
          },
          {
            "text": "2.0",
            "start": 390.61,
            "end": 392.76
          },
          {
            "text": "with",
            "start": 392.87,
            "end": 395.02
          },
          {
            "text": "just-in-time",
            "start": 395.13,
            "end": 397.28
          },
          {
            "text": "and",
            "start": 397.39,
            "end": 399.54
          },
          {
            "text": "SCIM",
            "start": 399.65,
            "end": 401.8
          },
          {
            "text": "provisioning,",
            "start": 401.91,
            "end": 404.06
          },
          {
            "text": "along",
            "start": 404.17,
            "end": 406.32
          },
          {
            "text": "with",
            "start": 406.43,
            "end": 408.58
          },
          {
            "text": "end-to-end",
            "start": 408.7,
            "end": 410.84
          },
          {
            "text": "AES-256",
            "start": 410.96,
            "end": 413.1
          },
          {
            "text": "encryption",
            "start": 413.22,
            "end": 415.37
          },
          {
            "text": "at",
            "start": 415.48,
            "end": 417.63
          },
          {
            "text": "rest.",
            "start": 417.74,
            "end": 419.89
          }
        ]
      },
      {
        "id": "seg-2-010",
        "speakerId": "spk-s1",
        "start": 425,
        "end": 480,
        "text": "I will send over our complete SOC2 Type II compliance pack and penetration test summary right after this call for your security review team.",
        "words": [
          {
            "text": "I",
            "start": 425,
            "end": 427.18
          },
          {
            "text": "will",
            "start": 427.29,
            "end": 429.47
          },
          {
            "text": "send",
            "start": 429.58,
            "end": 431.76
          },
          {
            "text": "over",
            "start": 431.88,
            "end": 434.05
          },
          {
            "text": "our",
            "start": 434.17,
            "end": 436.34
          },
          {
            "text": "complete",
            "start": 436.46,
            "end": 438.64
          },
          {
            "text": "SOC2",
            "start": 438.75,
            "end": 440.93
          },
          {
            "text": "Type",
            "start": 441.04,
            "end": 443.22
          },
          {
            "text": "II",
            "start": 443.33,
            "end": 445.51
          },
          {
            "text": "compliance",
            "start": 445.63,
            "end": 447.8
          },
          {
            "text": "pack",
            "start": 447.92,
            "end": 450.09
          },
          {
            "text": "and",
            "start": 450.21,
            "end": 452.39
          },
          {
            "text": "penetration",
            "start": 452.5,
            "end": 454.68
          },
          {
            "text": "test",
            "start": 454.79,
            "end": 456.97
          },
          {
            "text": "summary",
            "start": 457.08,
            "end": 459.26
          },
          {
            "text": "right",
            "start": 459.38,
            "end": 461.55
          },
          {
            "text": "after",
            "start": 461.67,
            "end": 463.84
          },
          {
            "text": "this",
            "start": 463.96,
            "end": 466.14
          },
          {
            "text": "call",
            "start": 466.25,
            "end": 468.43
          },
          {
            "text": "for",
            "start": 468.54,
            "end": 470.72
          },
          {
            "text": "your",
            "start": 470.83,
            "end": 473.01
          },
          {
            "text": "security",
            "start": 473.13,
            "end": 475.3
          },
          {
            "text": "review",
            "start": 475.42,
            "end": 477.59
          },
          {
            "text": "team.",
            "start": 477.71,
            "end": 479.89
          }
        ]
      },
      {
        "id": "seg-2-011",
        "speakerId": "spk-s3",
        "start": 485,
        "end": 545,
        "text": "Let's see a live demonstration of how the AI extracts technical action items and integrates with Jira and Linear.",
        "words": [
          {
            "text": "Let's",
            "start": 485,
            "end": 488
          },
          {
            "text": "see",
            "start": 488.16,
            "end": 491.16
          },
          {
            "text": "a",
            "start": 491.32,
            "end": 494.32
          },
          {
            "text": "live",
            "start": 494.47,
            "end": 497.47
          },
          {
            "text": "demonstration",
            "start": 497.63,
            "end": 500.63
          },
          {
            "text": "of",
            "start": 500.79,
            "end": 503.79
          },
          {
            "text": "how",
            "start": 503.95,
            "end": 506.95
          },
          {
            "text": "the",
            "start": 507.11,
            "end": 510.11
          },
          {
            "text": "AI",
            "start": 510.26,
            "end": 513.26
          },
          {
            "text": "extracts",
            "start": 513.42,
            "end": 516.42
          },
          {
            "text": "technical",
            "start": 516.58,
            "end": 519.58
          },
          {
            "text": "action",
            "start": 519.74,
            "end": 522.74
          },
          {
            "text": "items",
            "start": 522.89,
            "end": 525.89
          },
          {
            "text": "and",
            "start": 526.05,
            "end": 529.05
          },
          {
            "text": "integrates",
            "start": 529.21,
            "end": 532.21
          },
          {
            "text": "with",
            "start": 532.37,
            "end": 535.37
          },
          {
            "text": "Jira",
            "start": 535.53,
            "end": 538.53
          },
          {
            "text": "and",
            "start": 538.68,
            "end": 541.68
          },
          {
            "text": "Linear.",
            "start": 541.84,
            "end": 544.84
          }
        ]
      },
      {
        "id": "seg-2-012",
        "speakerId": "spk-s2",
        "start": 550,
        "end": 620,
        "text": "Notice how the model detects commitments in real-time, tags the owner, extracts the deadline, and provides a clickable timestamp that seeks the video directly to the moment.",
        "words": [
          {
            "text": "Notice",
            "start": 550,
            "end": 552.46
          },
          {
            "text": "how",
            "start": 552.59,
            "end": 555.06
          },
          {
            "text": "the",
            "start": 555.19,
            "end": 557.65
          },
          {
            "text": "model",
            "start": 557.78,
            "end": 560.24
          },
          {
            "text": "detects",
            "start": 560.37,
            "end": 562.83
          },
          {
            "text": "commitments",
            "start": 562.96,
            "end": 565.43
          },
          {
            "text": "in",
            "start": 565.56,
            "end": 568.02
          },
          {
            "text": "real-time,",
            "start": 568.15,
            "end": 570.61
          },
          {
            "text": "tags",
            "start": 570.74,
            "end": 573.2
          },
          {
            "text": "the",
            "start": 573.33,
            "end": 575.8
          },
          {
            "text": "owner,",
            "start": 575.93,
            "end": 578.39
          },
          {
            "text": "extracts",
            "start": 578.52,
            "end": 580.98
          },
          {
            "text": "the",
            "start": 581.11,
            "end": 583.57
          },
          {
            "text": "deadline,",
            "start": 583.7,
            "end": 586.17
          },
          {
            "text": "and",
            "start": 586.3,
            "end": 588.76
          },
          {
            "text": "provides",
            "start": 588.89,
            "end": 591.35
          },
          {
            "text": "a",
            "start": 591.48,
            "end": 593.94
          },
          {
            "text": "clickable",
            "start": 594.07,
            "end": 596.54
          },
          {
            "text": "timestamp",
            "start": 596.67,
            "end": 599.13
          },
          {
            "text": "that",
            "start": 599.26,
            "end": 601.72
          },
          {
            "text": "seeks",
            "start": 601.85,
            "end": 604.31
          },
          {
            "text": "the",
            "start": 604.44,
            "end": 606.91
          },
          {
            "text": "video",
            "start": 607.04,
            "end": 609.5
          },
          {
            "text": "directly",
            "start": 609.63,
            "end": 612.09
          },
          {
            "text": "to",
            "start": 612.22,
            "end": 614.69
          },
          {
            "text": "the",
            "start": 614.81,
            "end": 617.28
          },
          {
            "text": "moment.",
            "start": 617.41,
            "end": 619.87
          }
        ]
      },
      {
        "id": "seg-2-013",
        "speakerId": "spk-s3",
        "start": 625,
        "end": 690,
        "text": "That timestamp seek feature is fantastic. When an engineer reviews an assigned ticket, they can listen to the exact twenty-second context without watching the whole recording.",
        "words": [
          {
            "text": "That",
            "start": 625,
            "end": 627.38
          },
          {
            "text": "timestamp",
            "start": 627.5,
            "end": 629.88
          },
          {
            "text": "seek",
            "start": 630,
            "end": 632.38
          },
          {
            "text": "feature",
            "start": 632.5,
            "end": 634.88
          },
          {
            "text": "is",
            "start": 635,
            "end": 637.38
          },
          {
            "text": "fantastic.",
            "start": 637.5,
            "end": 639.88
          },
          {
            "text": "When",
            "start": 640,
            "end": 642.38
          },
          {
            "text": "an",
            "start": 642.5,
            "end": 644.88
          },
          {
            "text": "engineer",
            "start": 645,
            "end": 647.38
          },
          {
            "text": "reviews",
            "start": 647.5,
            "end": 649.88
          },
          {
            "text": "an",
            "start": 650,
            "end": 652.38
          },
          {
            "text": "assigned",
            "start": 652.5,
            "end": 654.88
          },
          {
            "text": "ticket,",
            "start": 655,
            "end": 657.38
          },
          {
            "text": "they",
            "start": 657.5,
            "end": 659.88
          },
          {
            "text": "can",
            "start": 660,
            "end": 662.38
          },
          {
            "text": "listen",
            "start": 662.5,
            "end": 664.88
          },
          {
            "text": "to",
            "start": 665,
            "end": 667.38
          },
          {
            "text": "the",
            "start": 667.5,
            "end": 669.88
          },
          {
            "text": "exact",
            "start": 670,
            "end": 672.38
          },
          {
            "text": "twenty-second",
            "start": 672.5,
            "end": 674.88
          },
          {
            "text": "context",
            "start": 675,
            "end": 677.38
          },
          {
            "text": "without",
            "start": 677.5,
            "end": 679.88
          },
          {
            "text": "watching",
            "start": 680,
            "end": 682.38
          },
          {
            "text": "the",
            "start": 682.5,
            "end": 684.88
          },
          {
            "text": "whole",
            "start": 685,
            "end": 687.38
          },
          {
            "text": "recording.",
            "start": 687.5,
            "end": 689.88
          }
        ]
      },
      {
        "id": "seg-2-014",
        "speakerId": "spk-s1",
        "start": 695,
        "end": 765,
        "text": "Exactly Thomas. In addition, the Action Items Inbox aggregates every task assigned to an engineer across all their meetings into one unified dashboard.",
        "words": [
          {
            "text": "Exactly",
            "start": 695,
            "end": 697.89
          },
          {
            "text": "Thomas.",
            "start": 698.04,
            "end": 700.93
          },
          {
            "text": "In",
            "start": 701.09,
            "end": 703.98
          },
          {
            "text": "addition,",
            "start": 704.13,
            "end": 707.02
          },
          {
            "text": "the",
            "start": 707.17,
            "end": 710.07
          },
          {
            "text": "Action",
            "start": 710.22,
            "end": 713.11
          },
          {
            "text": "Items",
            "start": 713.26,
            "end": 716.15
          },
          {
            "text": "Inbox",
            "start": 716.3,
            "end": 719.2
          },
          {
            "text": "aggregates",
            "start": 719.35,
            "end": 722.24
          },
          {
            "text": "every",
            "start": 722.39,
            "end": 725.28
          },
          {
            "text": "task",
            "start": 725.43,
            "end": 728.33
          },
          {
            "text": "assigned",
            "start": 728.48,
            "end": 731.37
          },
          {
            "text": "to",
            "start": 731.52,
            "end": 734.41
          },
          {
            "text": "an",
            "start": 734.57,
            "end": 737.46
          },
          {
            "text": "engineer",
            "start": 737.61,
            "end": 740.5
          },
          {
            "text": "across",
            "start": 740.65,
            "end": 743.54
          },
          {
            "text": "all",
            "start": 743.7,
            "end": 746.59
          },
          {
            "text": "their",
            "start": 746.74,
            "end": 749.63
          },
          {
            "text": "meetings",
            "start": 749.78,
            "end": 752.67
          },
          {
            "text": "into",
            "start": 752.83,
            "end": 755.72
          },
          {
            "text": "one",
            "start": 755.87,
            "end": 758.76
          },
          {
            "text": "unified",
            "start": 758.91,
            "end": 761.8
          },
          {
            "text": "dashboard.",
            "start": 761.96,
            "end": 764.85
          }
        ]
      },
      {
        "id": "seg-2-015",
        "speakerId": "spk-s3",
        "start": 770,
        "end": 835,
        "text": "What does the pilot rollout look like for our first cohort of seventy-five engineering team leads?",
        "words": [
          {
            "text": "What",
            "start": 770,
            "end": 773.86
          },
          {
            "text": "does",
            "start": 774.06,
            "end": 777.92
          },
          {
            "text": "the",
            "start": 778.13,
            "end": 781.98
          },
          {
            "text": "pilot",
            "start": 782.19,
            "end": 786.05
          },
          {
            "text": "rollout",
            "start": 786.25,
            "end": 790.11
          },
          {
            "text": "look",
            "start": 790.31,
            "end": 794.17
          },
          {
            "text": "like",
            "start": 794.38,
            "end": 798.23
          },
          {
            "text": "for",
            "start": 798.44,
            "end": 802.3
          },
          {
            "text": "our",
            "start": 802.5,
            "end": 806.36
          },
          {
            "text": "first",
            "start": 806.56,
            "end": 810.42
          },
          {
            "text": "cohort",
            "start": 810.63,
            "end": 814.48
          },
          {
            "text": "of",
            "start": 814.69,
            "end": 818.55
          },
          {
            "text": "seventy-five",
            "start": 818.75,
            "end": 822.61
          },
          {
            "text": "engineering",
            "start": 822.81,
            "end": 826.67
          },
          {
            "text": "team",
            "start": 826.88,
            "end": 830.73
          },
          {
            "text": "leads?",
            "start": 830.94,
            "end": 834.8
          }
        ]
      },
      {
        "id": "seg-2-016",
        "speakerId": "spk-s1",
        "start": 840,
        "end": 910,
        "text": "We can provision a dedicated enterprise staging sandbox this week with SSO enabled. Rachel will personally oversee the sandbox configuration.",
        "words": [
          {
            "text": "We",
            "start": 840,
            "end": 843.33
          },
          {
            "text": "can",
            "start": 843.5,
            "end": 846.83
          },
          {
            "text": "provision",
            "start": 847,
            "end": 850.33
          },
          {
            "text": "a",
            "start": 850.5,
            "end": 853.83
          },
          {
            "text": "dedicated",
            "start": 854,
            "end": 857.33
          },
          {
            "text": "enterprise",
            "start": 857.5,
            "end": 860.83
          },
          {
            "text": "staging",
            "start": 861,
            "end": 864.33
          },
          {
            "text": "sandbox",
            "start": 864.5,
            "end": 867.83
          },
          {
            "text": "this",
            "start": 868,
            "end": 871.33
          },
          {
            "text": "week",
            "start": 871.5,
            "end": 874.83
          },
          {
            "text": "with",
            "start": 875,
            "end": 878.33
          },
          {
            "text": "SSO",
            "start": 878.5,
            "end": 881.83
          },
          {
            "text": "enabled.",
            "start": 882,
            "end": 885.33
          },
          {
            "text": "Rachel",
            "start": 885.5,
            "end": 888.83
          },
          {
            "text": "will",
            "start": 889,
            "end": 892.33
          },
          {
            "text": "personally",
            "start": 892.5,
            "end": 895.83
          },
          {
            "text": "oversee",
            "start": 896,
            "end": 899.33
          },
          {
            "text": "the",
            "start": 899.5,
            "end": 902.83
          },
          {
            "text": "sandbox",
            "start": 903,
            "end": 906.33
          },
          {
            "text": "configuration.",
            "start": 906.5,
            "end": 909.83
          }
        ]
      },
      {
        "id": "seg-2-017",
        "speakerId": "spk-s4",
        "start": 915,
        "end": 980,
        "text": "If Rachel provisions the staging sandbox with Okta integration, my team can complete our identity verification and SAML assertion testing by Friday.",
        "words": [
          {
            "text": "If",
            "start": 915,
            "end": 917.81
          },
          {
            "text": "Rachel",
            "start": 917.95,
            "end": 920.76
          },
          {
            "text": "provisions",
            "start": 920.91,
            "end": 923.72
          },
          {
            "text": "the",
            "start": 923.86,
            "end": 926.67
          },
          {
            "text": "staging",
            "start": 926.82,
            "end": 929.63
          },
          {
            "text": "sandbox",
            "start": 929.77,
            "end": 932.58
          },
          {
            "text": "with",
            "start": 932.73,
            "end": 935.53
          },
          {
            "text": "Okta",
            "start": 935.68,
            "end": 938.49
          },
          {
            "text": "integration,",
            "start": 938.64,
            "end": 941.44
          },
          {
            "text": "my",
            "start": 941.59,
            "end": 944.4
          },
          {
            "text": "team",
            "start": 944.55,
            "end": 947.35
          },
          {
            "text": "can",
            "start": 947.5,
            "end": 950.31
          },
          {
            "text": "complete",
            "start": 950.45,
            "end": 953.26
          },
          {
            "text": "our",
            "start": 953.41,
            "end": 956.22
          },
          {
            "text": "identity",
            "start": 956.36,
            "end": 959.17
          },
          {
            "text": "verification",
            "start": 959.32,
            "end": 962.13
          },
          {
            "text": "and",
            "start": 962.27,
            "end": 965.08
          },
          {
            "text": "SAML",
            "start": 965.23,
            "end": 968.03
          },
          {
            "text": "assertion",
            "start": 968.18,
            "end": 970.99
          },
          {
            "text": "testing",
            "start": 971.14,
            "end": 973.94
          },
          {
            "text": "by",
            "start": 974.09,
            "end": 976.9
          },
          {
            "text": "Friday.",
            "start": 977.05,
            "end": 979.85
          }
        ]
      },
      {
        "id": "seg-2-018",
        "speakerId": "spk-s3",
        "start": 985,
        "end": 1055,
        "text": "And if security clears by Friday, I would like to approve a five-hundred seat enterprise pilot rollout starting next Monday.",
        "words": [
          {
            "text": "And",
            "start": 985,
            "end": 988.33
          },
          {
            "text": "if",
            "start": 988.5,
            "end": 991.83
          },
          {
            "text": "security",
            "start": 992,
            "end": 995.33
          },
          {
            "text": "clears",
            "start": 995.5,
            "end": 998.83
          },
          {
            "text": "by",
            "start": 999,
            "end": 1002.33
          },
          {
            "text": "Friday,",
            "start": 1002.5,
            "end": 1005.83
          },
          {
            "text": "I",
            "start": 1006,
            "end": 1009.33
          },
          {
            "text": "would",
            "start": 1009.5,
            "end": 1012.83
          },
          {
            "text": "like",
            "start": 1013,
            "end": 1016.33
          },
          {
            "text": "to",
            "start": 1016.5,
            "end": 1019.83
          },
          {
            "text": "approve",
            "start": 1020,
            "end": 1023.33
          },
          {
            "text": "a",
            "start": 1023.5,
            "end": 1026.83
          },
          {
            "text": "five-hundred",
            "start": 1027,
            "end": 1030.33
          },
          {
            "text": "seat",
            "start": 1030.5,
            "end": 1033.83
          },
          {
            "text": "enterprise",
            "start": 1034,
            "end": 1037.33
          },
          {
            "text": "pilot",
            "start": 1037.5,
            "end": 1040.83
          },
          {
            "text": "rollout",
            "start": 1041,
            "end": 1044.33
          },
          {
            "text": "starting",
            "start": 1044.5,
            "end": 1047.83
          },
          {
            "text": "next",
            "start": 1048,
            "end": 1051.33
          },
          {
            "text": "Monday.",
            "start": 1051.5,
            "end": 1054.83
          }
        ]
      },
      {
        "id": "seg-2-019",
        "speakerId": "spk-s1",
        "start": 1060,
        "end": 1130,
        "text": "That aligns perfectly with our enterprise roadmap. For a five-hundred seat annual deployment, we include dedicated Slack support and custom AI prompt tuning.",
        "words": [
          {
            "text": "That",
            "start": 1060,
            "end": 1062.89
          },
          {
            "text": "aligns",
            "start": 1063.04,
            "end": 1065.93
          },
          {
            "text": "perfectly",
            "start": 1066.09,
            "end": 1068.98
          },
          {
            "text": "with",
            "start": 1069.13,
            "end": 1072.02
          },
          {
            "text": "our",
            "start": 1072.17,
            "end": 1075.07
          },
          {
            "text": "enterprise",
            "start": 1075.22,
            "end": 1078.11
          },
          {
            "text": "roadmap.",
            "start": 1078.26,
            "end": 1081.15
          },
          {
            "text": "For",
            "start": 1081.3,
            "end": 1084.2
          },
          {
            "text": "a",
            "start": 1084.35,
            "end": 1087.24
          },
          {
            "text": "five-hundred",
            "start": 1087.39,
            "end": 1090.28
          },
          {
            "text": "seat",
            "start": 1090.43,
            "end": 1093.33
          },
          {
            "text": "annual",
            "start": 1093.48,
            "end": 1096.37
          },
          {
            "text": "deployment,",
            "start": 1096.52,
            "end": 1099.41
          },
          {
            "text": "we",
            "start": 1099.57,
            "end": 1102.46
          },
          {
            "text": "include",
            "start": 1102.61,
            "end": 1105.5
          },
          {
            "text": "dedicated",
            "start": 1105.65,
            "end": 1108.54
          },
          {
            "text": "Slack",
            "start": 1108.7,
            "end": 1111.59
          },
          {
            "text": "support",
            "start": 1111.74,
            "end": 1114.63
          },
          {
            "text": "and",
            "start": 1114.78,
            "end": 1117.67
          },
          {
            "text": "custom",
            "start": 1117.83,
            "end": 1120.72
          },
          {
            "text": "AI",
            "start": 1120.87,
            "end": 1123.76
          },
          {
            "text": "prompt",
            "start": 1123.91,
            "end": 1126.8
          },
          {
            "text": "tuning.",
            "start": 1126.96,
            "end": 1129.85
          }
        ]
      },
      {
        "id": "seg-2-020",
        "speakerId": "spk-s3",
        "start": 1135,
        "end": 1205,
        "text": "Can you provide custom prompt templates that follow Acme's internal RFC format for architecture decision records?",
        "words": [
          {
            "text": "Can",
            "start": 1135,
            "end": 1139.16
          },
          {
            "text": "you",
            "start": 1139.38,
            "end": 1143.53
          },
          {
            "text": "provide",
            "start": 1143.75,
            "end": 1147.91
          },
          {
            "text": "custom",
            "start": 1148.13,
            "end": 1152.28
          },
          {
            "text": "prompt",
            "start": 1152.5,
            "end": 1156.66
          },
          {
            "text": "templates",
            "start": 1156.88,
            "end": 1161.03
          },
          {
            "text": "that",
            "start": 1161.25,
            "end": 1165.41
          },
          {
            "text": "follow",
            "start": 1165.63,
            "end": 1169.78
          },
          {
            "text": "Acme's",
            "start": 1170,
            "end": 1174.16
          },
          {
            "text": "internal",
            "start": 1174.38,
            "end": 1178.53
          },
          {
            "text": "RFC",
            "start": 1178.75,
            "end": 1182.91
          },
          {
            "text": "format",
            "start": 1183.13,
            "end": 1187.28
          },
          {
            "text": "for",
            "start": 1187.5,
            "end": 1191.66
          },
          {
            "text": "architecture",
            "start": 1191.88,
            "end": 1196.03
          },
          {
            "text": "decision",
            "start": 1196.25,
            "end": 1200.41
          },
          {
            "text": "records?",
            "start": 1200.63,
            "end": 1204.78
          }
        ]
      },
      {
        "id": "seg-2-021",
        "speakerId": "spk-s2",
        "start": 1210,
        "end": 1280,
        "text": "Yes! Our custom template engine allows Acme administrators to define system prompts that output structured markdown matching your exact RFC headings.",
        "words": [
          {
            "text": "Yes!",
            "start": 1210,
            "end": 1213.17
          },
          {
            "text": "Our",
            "start": 1213.33,
            "end": 1216.5
          },
          {
            "text": "custom",
            "start": 1216.67,
            "end": 1219.83
          },
          {
            "text": "template",
            "start": 1220,
            "end": 1223.17
          },
          {
            "text": "engine",
            "start": 1223.33,
            "end": 1226.5
          },
          {
            "text": "allows",
            "start": 1226.67,
            "end": 1229.83
          },
          {
            "text": "Acme",
            "start": 1230,
            "end": 1233.17
          },
          {
            "text": "administrators",
            "start": 1233.33,
            "end": 1236.5
          },
          {
            "text": "to",
            "start": 1236.67,
            "end": 1239.83
          },
          {
            "text": "define",
            "start": 1240,
            "end": 1243.17
          },
          {
            "text": "system",
            "start": 1243.33,
            "end": 1246.5
          },
          {
            "text": "prompts",
            "start": 1246.67,
            "end": 1249.83
          },
          {
            "text": "that",
            "start": 1250,
            "end": 1253.17
          },
          {
            "text": "output",
            "start": 1253.33,
            "end": 1256.5
          },
          {
            "text": "structured",
            "start": 1256.67,
            "end": 1259.83
          },
          {
            "text": "markdown",
            "start": 1260,
            "end": 1263.17
          },
          {
            "text": "matching",
            "start": 1263.33,
            "end": 1266.5
          },
          {
            "text": "your",
            "start": 1266.67,
            "end": 1269.83
          },
          {
            "text": "exact",
            "start": 1270,
            "end": 1273.17
          },
          {
            "text": "RFC",
            "start": 1273.33,
            "end": 1276.5
          },
          {
            "text": "headings.",
            "start": 1276.67,
            "end": 1279.83
          }
        ]
      },
      {
        "id": "seg-2-022",
        "speakerId": "spk-s4",
        "start": 1285,
        "end": 1355,
        "text": "Samantha here. I have reviewed the high-level security architecture and it satisfies our initial compliance checklist. We will review the formal audit package.",
        "words": [
          {
            "text": "Samantha",
            "start": 1285,
            "end": 1287.89
          },
          {
            "text": "here.",
            "start": 1288.04,
            "end": 1290.93
          },
          {
            "text": "I",
            "start": 1291.09,
            "end": 1293.98
          },
          {
            "text": "have",
            "start": 1294.13,
            "end": 1297.02
          },
          {
            "text": "reviewed",
            "start": 1297.17,
            "end": 1300.07
          },
          {
            "text": "the",
            "start": 1300.22,
            "end": 1303.11
          },
          {
            "text": "high-level",
            "start": 1303.26,
            "end": 1306.15
          },
          {
            "text": "security",
            "start": 1306.3,
            "end": 1309.2
          },
          {
            "text": "architecture",
            "start": 1309.35,
            "end": 1312.24
          },
          {
            "text": "and",
            "start": 1312.39,
            "end": 1315.28
          },
          {
            "text": "it",
            "start": 1315.43,
            "end": 1318.33
          },
          {
            "text": "satisfies",
            "start": 1318.48,
            "end": 1321.37
          },
          {
            "text": "our",
            "start": 1321.52,
            "end": 1324.41
          },
          {
            "text": "initial",
            "start": 1324.57,
            "end": 1327.46
          },
          {
            "text": "compliance",
            "start": 1327.61,
            "end": 1330.5
          },
          {
            "text": "checklist.",
            "start": 1330.65,
            "end": 1333.54
          },
          {
            "text": "We",
            "start": 1333.7,
            "end": 1336.59
          },
          {
            "text": "will",
            "start": 1336.74,
            "end": 1339.63
          },
          {
            "text": "review",
            "start": 1339.78,
            "end": 1342.67
          },
          {
            "text": "the",
            "start": 1342.83,
            "end": 1345.72
          },
          {
            "text": "formal",
            "start": 1345.87,
            "end": 1348.76
          },
          {
            "text": "audit",
            "start": 1348.91,
            "end": 1351.8
          },
          {
            "text": "package.",
            "start": 1351.96,
            "end": 1354.85
          }
        ]
      },
      {
        "id": "seg-2-023",
        "speakerId": "spk-s1",
        "start": 1360,
        "end": 1435,
        "text": "I will prepare the Master Services Agreement with volume discount tiers and our standard business associate agreement clauses.",
        "words": [
          {
            "text": "I",
            "start": 1360,
            "end": 1363.96
          },
          {
            "text": "will",
            "start": 1364.17,
            "end": 1368.13
          },
          {
            "text": "prepare",
            "start": 1368.33,
            "end": 1372.29
          },
          {
            "text": "the",
            "start": 1372.5,
            "end": 1376.46
          },
          {
            "text": "Master",
            "start": 1376.67,
            "end": 1380.63
          },
          {
            "text": "Services",
            "start": 1380.83,
            "end": 1384.79
          },
          {
            "text": "Agreement",
            "start": 1385,
            "end": 1388.96
          },
          {
            "text": "with",
            "start": 1389.17,
            "end": 1393.13
          },
          {
            "text": "volume",
            "start": 1393.33,
            "end": 1397.29
          },
          {
            "text": "discount",
            "start": 1397.5,
            "end": 1401.46
          },
          {
            "text": "tiers",
            "start": 1401.67,
            "end": 1405.63
          },
          {
            "text": "and",
            "start": 1405.83,
            "end": 1409.79
          },
          {
            "text": "our",
            "start": 1410,
            "end": 1413.96
          },
          {
            "text": "standard",
            "start": 1414.17,
            "end": 1418.13
          },
          {
            "text": "business",
            "start": 1418.33,
            "end": 1422.29
          },
          {
            "text": "associate",
            "start": 1422.5,
            "end": 1426.46
          },
          {
            "text": "agreement",
            "start": 1426.67,
            "end": 1430.63
          },
          {
            "text": "clauses.",
            "start": 1430.83,
            "end": 1434.79
          }
        ]
      },
      {
        "id": "seg-2-024",
        "speakerId": "spk-s3",
        "start": 1440,
        "end": 1515,
        "text": "Thomas here. Let's schedule a technical deep-dive session next Tuesday with our engineering directors to introduce them to the sandbox.",
        "words": [
          {
            "text": "Thomas",
            "start": 1440,
            "end": 1443.56
          },
          {
            "text": "here.",
            "start": 1443.75,
            "end": 1447.31
          },
          {
            "text": "Let's",
            "start": 1447.5,
            "end": 1451.06
          },
          {
            "text": "schedule",
            "start": 1451.25,
            "end": 1454.81
          },
          {
            "text": "a",
            "start": 1455,
            "end": 1458.56
          },
          {
            "text": "technical",
            "start": 1458.75,
            "end": 1462.31
          },
          {
            "text": "deep-dive",
            "start": 1462.5,
            "end": 1466.06
          },
          {
            "text": "session",
            "start": 1466.25,
            "end": 1469.81
          },
          {
            "text": "next",
            "start": 1470,
            "end": 1473.56
          },
          {
            "text": "Tuesday",
            "start": 1473.75,
            "end": 1477.31
          },
          {
            "text": "with",
            "start": 1477.5,
            "end": 1481.06
          },
          {
            "text": "our",
            "start": 1481.25,
            "end": 1484.81
          },
          {
            "text": "engineering",
            "start": 1485,
            "end": 1488.56
          },
          {
            "text": "directors",
            "start": 1488.75,
            "end": 1492.31
          },
          {
            "text": "to",
            "start": 1492.5,
            "end": 1496.06
          },
          {
            "text": "introduce",
            "start": 1496.25,
            "end": 1499.81
          },
          {
            "text": "them",
            "start": 1500,
            "end": 1503.56
          },
          {
            "text": "to",
            "start": 1503.75,
            "end": 1507.31
          },
          {
            "text": "the",
            "start": 1507.5,
            "end": 1511.06
          },
          {
            "text": "sandbox.",
            "start": 1511.25,
            "end": 1514.81
          }
        ]
      },
      {
        "id": "seg-2-025",
        "speakerId": "spk-s2",
        "start": 1520,
        "end": 1590,
        "text": "I will prepare the technical deep-dive deck and sandbox credentials for your directors ahead of Tuesday's session.",
        "words": [
          {
            "text": "I",
            "start": 1520,
            "end": 1523.91
          },
          {
            "text": "will",
            "start": 1524.12,
            "end": 1528.03
          },
          {
            "text": "prepare",
            "start": 1528.24,
            "end": 1532.15
          },
          {
            "text": "the",
            "start": 1532.35,
            "end": 1536.26
          },
          {
            "text": "technical",
            "start": 1536.47,
            "end": 1540.38
          },
          {
            "text": "deep-dive",
            "start": 1540.59,
            "end": 1544.5
          },
          {
            "text": "deck",
            "start": 1544.71,
            "end": 1548.62
          },
          {
            "text": "and",
            "start": 1548.82,
            "end": 1552.74
          },
          {
            "text": "sandbox",
            "start": 1552.94,
            "end": 1556.85
          },
          {
            "text": "credentials",
            "start": 1557.06,
            "end": 1560.97
          },
          {
            "text": "for",
            "start": 1561.18,
            "end": 1565.09
          },
          {
            "text": "your",
            "start": 1565.29,
            "end": 1569.21
          },
          {
            "text": "directors",
            "start": 1569.41,
            "end": 1573.32
          },
          {
            "text": "ahead",
            "start": 1573.53,
            "end": 1577.44
          },
          {
            "text": "of",
            "start": 1577.65,
            "end": 1581.56
          },
          {
            "text": "Tuesday's",
            "start": 1581.76,
            "end": 1585.68
          },
          {
            "text": "session.",
            "start": 1585.88,
            "end": 1589.79
          }
        ]
      },
      {
        "id": "seg-2-026",
        "speakerId": "spk-s1",
        "start": 1595,
        "end": 1660,
        "text": "Thank you Thomas and Samantha. We are very excited to partner with Acme Corp to transform your team's meeting productivity.",
        "words": [
          {
            "text": "Thank",
            "start": 1595,
            "end": 1598.09
          },
          {
            "text": "you",
            "start": 1598.25,
            "end": 1601.34
          },
          {
            "text": "Thomas",
            "start": 1601.5,
            "end": 1604.59
          },
          {
            "text": "and",
            "start": 1604.75,
            "end": 1607.84
          },
          {
            "text": "Samantha.",
            "start": 1608,
            "end": 1611.09
          },
          {
            "text": "We",
            "start": 1611.25,
            "end": 1614.34
          },
          {
            "text": "are",
            "start": 1614.5,
            "end": 1617.59
          },
          {
            "text": "very",
            "start": 1617.75,
            "end": 1620.84
          },
          {
            "text": "excited",
            "start": 1621,
            "end": 1624.09
          },
          {
            "text": "to",
            "start": 1624.25,
            "end": 1627.34
          },
          {
            "text": "partner",
            "start": 1627.5,
            "end": 1630.59
          },
          {
            "text": "with",
            "start": 1630.75,
            "end": 1633.84
          },
          {
            "text": "Acme",
            "start": 1634,
            "end": 1637.09
          },
          {
            "text": "Corp",
            "start": 1637.25,
            "end": 1640.34
          },
          {
            "text": "to",
            "start": 1640.5,
            "end": 1643.59
          },
          {
            "text": "transform",
            "start": 1643.75,
            "end": 1646.84
          },
          {
            "text": "your",
            "start": 1647,
            "end": 1650.09
          },
          {
            "text": "team's",
            "start": 1650.25,
            "end": 1653.34
          },
          {
            "text": "meeting",
            "start": 1653.5,
            "end": 1656.59
          },
          {
            "text": "productivity.",
            "start": 1656.75,
            "end": 1659.84
          }
        ]
      },
      {
        "id": "seg-2-027",
        "speakerId": "spk-s3",
        "start": 1665,
        "end": 1720,
        "text": "Thank you Jordan and Rachel. Looking forward to receiving the sandbox credentials and reviewing the proposal.",
        "words": [
          {
            "text": "Thank",
            "start": 1665,
            "end": 1668.27
          },
          {
            "text": "you",
            "start": 1668.44,
            "end": 1671.7
          },
          {
            "text": "Jordan",
            "start": 1671.88,
            "end": 1675.14
          },
          {
            "text": "and",
            "start": 1675.31,
            "end": 1678.58
          },
          {
            "text": "Rachel.",
            "start": 1678.75,
            "end": 1682.02
          },
          {
            "text": "Looking",
            "start": 1682.19,
            "end": 1685.45
          },
          {
            "text": "forward",
            "start": 1685.63,
            "end": 1688.89
          },
          {
            "text": "to",
            "start": 1689.06,
            "end": 1692.33
          },
          {
            "text": "receiving",
            "start": 1692.5,
            "end": 1695.77
          },
          {
            "text": "the",
            "start": 1695.94,
            "end": 1699.2
          },
          {
            "text": "sandbox",
            "start": 1699.38,
            "end": 1702.64
          },
          {
            "text": "credentials",
            "start": 1702.81,
            "end": 1706.08
          },
          {
            "text": "and",
            "start": 1706.25,
            "end": 1709.52
          },
          {
            "text": "reviewing",
            "start": 1709.69,
            "end": 1712.95
          },
          {
            "text": "the",
            "start": 1713.13,
            "end": 1716.39
          },
          {
            "text": "proposal.",
            "start": 1716.56,
            "end": 1719.83
          }
        ]
      }
    ],
    "highlights": [
      {
        "id": "hl-2-1",
        "meetingId": "meeting-2",
        "title": "Zero-Data Retention & LLM Training Policy Clarified",
        "start": 250,
        "end": 320,
        "category": "decision",
        "color": "#8B5CF6",
        "createdAt": "2026-09-11T16:35:00.000Z"
      },
      {
        "id": "hl-2-2",
        "meetingId": "meeting-2",
        "title": "Acme Approves 500-Seat Pilot Subject to SSO Clearance",
        "start": 880,
        "end": 960,
        "category": "key_moment",
        "color": "#3B82F6",
        "createdAt": "2026-09-11T16:45:00.000Z"
      },
      {
        "id": "hl-2-3",
        "meetingId": "meeting-2",
        "title": "Custom RFC Architecture Template Demonstration",
        "start": 1180,
        "end": 1250,
        "category": "action",
        "color": "#10B981",
        "createdAt": "2026-09-11T16:50:30.000Z"
      }
    ],
    "actionItems": [
      {
        "id": "act-2-1",
        "meetingId": "meeting-2",
        "meetingTitle": "Acme Corp <> Fathom Enterprise Evaluation",
        "text": "Send Acme Corp customized MSA with enterprise volume discount tiers and BAA addendum",
        "assigneeId": "spk-s1",
        "completed": true,
        "timestamp": 450,
        "priority": "high",
        "dueDate": "2026-09-15"
      },
      {
        "id": "act-2-2",
        "meetingId": "meeting-2",
        "meetingTitle": "Acme Corp <> Fathom Enterprise Evaluation",
        "text": "Provision dedicated staging sandbox with Okta SAML 2.0 and SCIM user provisioning",
        "assigneeId": "spk-s2",
        "completed": false,
        "timestamp": 880,
        "priority": "high",
        "dueDate": "2026-09-17"
      },
      {
        "id": "act-2-3",
        "meetingId": "meeting-2",
        "meetingTitle": "Acme Corp <> Fathom Enterprise Evaluation",
        "text": "Review Fathom SOC2 Type II compliance pack and external penetration test audit",
        "assigneeId": "spk-s4",
        "completed": false,
        "timestamp": 1280,
        "priority": "medium",
        "dueDate": "2026-09-18"
      },
      {
        "id": "act-2-4",
        "meetingId": "meeting-2",
        "meetingTitle": "Acme Corp <> Fathom Enterprise Evaluation",
        "text": "Schedule technical deep-dive demonstration with Acme engineering team directors",
        "assigneeId": "spk-s3",
        "completed": false,
        "timestamp": 1470,
        "priority": "medium",
        "dueDate": "2026-09-19"
      }
    ],
    "summaries": {
      "executive": {
        "id": "executive",
        "name": "Executive Summary",
        "icon": "Briefcase",
        "overview": "Enterprise discovery and technical evaluation between Fathom enterprise sales leadership and Acme Corp's VP of Engineering and Director of InfoSec. Acme is evaluating Fathom for 400+ engineering managers to eliminate 12 hours/week of manual meeting documentation. Fathom addressed core InfoSec criteria (zero LLM retention, Okta SAML/SCIM, SOC2 Type II) and secured approval for a 500-seat pilot pending staging identity verification.",
        "sections": [
          {
            "title": "Customer Pain Points & Business Value",
            "bullets": [
              "Acme engineering leads currently spend 12 hours weekly taking notes, drafting minutes, and chasing Linear/Jira ticket updates.",
              "Fathom's automated action item detection and sub-second seek timestamps deliver an estimated 80% reduction in meeting admin overhead."
            ],
            "timestampRefs": [
              {
                "text": "Acme pain points",
                "time": 78
              },
              {
                "text": "Timestamp seek demo",
                "time": 625
              }
            ]
          },
          {
            "title": "Security, Privacy & Identity Governance",
            "bullets": [
              "InfoSec confirmed non-negotiable requirement: zero customer data training on LLMs, fully satisfied by Fathom's zero-retention enterprise tier.",
              "Okta SAML 2.0 and SCIM automated provisioning supported natively with AES-256 encryption at rest."
            ],
            "timestampRefs": [
              {
                "text": "Zero data retention policy",
                "time": 258
              },
              {
                "text": "Okta SAML and SCIM",
                "time": 368
              }
            ]
          },
          {
            "title": "Commercial Path & Pilot Agreement",
            "bullets": [
              "Thomas Wright approved a 500-seat enterprise pilot rollout starting next week once identity integration clears.",
              "Dedicated staging sandbox with customized RFC prompt templates provisioned by Rachel Martinez."
            ],
            "timestampRefs": [
              {
                "text": "500-seat pilot approval",
                "time": 985
              },
              {
                "text": "Commercial contract terms",
                "time": 1360
              }
            ]
          }
        ]
      },
      "action_items": {
        "id": "action_items",
        "name": "Action Items & Next Steps",
        "icon": "CheckSquare",
        "overview": "Immediate commercial, technical, and security next steps to initiate Acme Corp's enterprise pilot.",
        "sections": [
          {
            "title": "Commercial & Legal Next Steps",
            "bullets": [
              "Jordan Lee: Send Acme Corp customized MSA with enterprise volume discount tiers and BAA addendum (Due: Sep 15).",
              "Samantha Vance: Review Fathom SOC2 Type II compliance pack and external penetration test audit (Due: Sep 18)."
            ],
            "timestampRefs": [
              {
                "text": "Jordan Lee MSA follow-up",
                "time": 425
              },
              {
                "text": "Samantha Vance compliance review",
                "time": 1285
              }
            ]
          },
          {
            "title": "Technical Sandbox & Implementation",
            "bullets": [
              "Rachel Martinez: Provision dedicated staging sandbox with Okta SAML 2.0 and SCIM user provisioning (Due: Sep 17).",
              "Thomas Wright: Schedule technical deep-dive demonstration with Acme engineering team directors (Due: Sep 19)."
            ],
            "timestampRefs": [
              {
                "text": "Rachel sandbox setup",
                "time": 840
              },
              {
                "text": "Thomas team session",
                "time": 1440
              }
            ]
          }
        ]
      },
      "sales": {
        "id": "sales",
        "name": "Sales & Customer Impact",
        "icon": "TrendingUp",
        "overview": "MEDDPICC sales discovery summary identifying Economic Buyer, Decision Criteria, and Pilot Milestones.",
        "sections": [
          {
            "title": "MEDDPICC Qualification Summary",
            "bullets": [
              "Metrics: 12 hrs/week saved per engineering manager x 400 managers = 4,800 hours reclaimed monthly.",
              "Economic Buyer: Thomas Wright, VP of Engineering, with direct signing authority for pilot budget.",
              "Decision Criteria: Zero LLM data retention, Okta SAML/SCIM compatibility, sub-second playback sync.",
              "Decision Process: Staging sandbox testing this week -> Security clearance by Friday -> 500-seat launch."
            ],
            "timestampRefs": [
              {
                "text": "Metric quantification",
                "time": 78
              },
              {
                "text": "Pilot commitment",
                "time": 985
              }
            ]
          },
          {
            "title": "Deal Size & Expansion Opportunity",
            "bullets": [
              "Initial Land: 500 enterprise seats ($180k ARR target).",
              "Expansion Potential: Total addressable seat count of 2,400 employees across product, sales, and operations at Acme."
            ],
            "timestampRefs": [
              {
                "text": "Pilot scope",
                "time": 985
              }
            ]
          }
        ]
      },
      "engineering": {
        "id": "engineering",
        "name": "Engineering & Architecture Notes",
        "icon": "Cpu",
        "overview": "Technical requirements and enterprise integration architecture captured during the discovery call.",
        "sections": [
          {
            "title": "Identity & Access Management Integration",
            "bullets": [
              "SAML 2.0 assertion mapping for Acme Okta tenant with custom department attributes.",
              "SCIM 2.0 REST API endpoint implementation for automated provisioning and de-provisioning upon employee offboarding."
            ],
            "timestampRefs": [
              {
                "text": "SCIM provisioning architecture",
                "time": 368
              }
            ]
          },
          {
            "title": "Custom LLM Prompt Template Pipeline",
            "bullets": [
              "Configurable system prompts allowing Acme engineering leads to auto-generate Architecture Decision Records (ADR) in Markdown.",
              "Direct webhook dispatch to Acme internal Linear instance for automated ticket creation from action items."
            ],
            "timestampRefs": [
              {
                "text": "Custom template RFC format",
                "time": 1210
              }
            ]
          }
        ]
      }
    },
    "tags": [
      "Sales",
      "Enterprise",
      "Discovery",
      "MEDDPICC",
      "Security"
    ]
  },
  {
    "id": "meeting-3",
    "title": "Fathom 2.0 Video Scrubber & Navigation Redesign",
    "date": "2026-09-10T10:00:00.000Z",
    "duration": 1100,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "participants": [
      {
        "id": "spk-d1",
        "name": "Chloe Dubois",
        "role": "Principal Product Designer",
        "company": "Fathom Design",
        "color": "#EC4899",
        "avatarUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-d2",
        "name": "Liam O'Connor",
        "role": "Senior Product Manager",
        "company": "Fathom Product",
        "color": "#8B5CF6",
        "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-d3",
        "name": "Kevin Zhang",
        "role": "Lead Frontend Engineer",
        "company": "Fathom Frontend",
        "color": "#3B82F6",
        "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-d4",
        "name": "Zoe Anderson",
        "role": "UX Researcher",
        "company": "Fathom Research",
        "color": "#10B981",
        "avatarUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
      }
    ],
    "transcript": [
      {
        "id": "seg-3-001",
        "speakerId": "spk-d2",
        "start": 0,
        "end": 32,
        "text": "Welcome to the design critique for the Fathom 2.0 video player scrubber and navigation overhaul. Liam here kicking us off.",
        "words": [
          {
            "text": "Welcome",
            "start": 0,
            "end": 1.52
          },
          {
            "text": "to",
            "start": 1.6,
            "end": 3.12
          },
          {
            "text": "the",
            "start": 3.2,
            "end": 4.72
          },
          {
            "text": "design",
            "start": 4.8,
            "end": 6.32
          },
          {
            "text": "critique",
            "start": 6.4,
            "end": 7.92
          },
          {
            "text": "for",
            "start": 8,
            "end": 9.52
          },
          {
            "text": "the",
            "start": 9.6,
            "end": 11.12
          },
          {
            "text": "Fathom",
            "start": 11.2,
            "end": 12.72
          },
          {
            "text": "2.0",
            "start": 12.8,
            "end": 14.32
          },
          {
            "text": "video",
            "start": 14.4,
            "end": 15.92
          },
          {
            "text": "player",
            "start": 16,
            "end": 17.52
          },
          {
            "text": "scrubber",
            "start": 17.6,
            "end": 19.12
          },
          {
            "text": "and",
            "start": 19.2,
            "end": 20.72
          },
          {
            "text": "navigation",
            "start": 20.8,
            "end": 22.32
          },
          {
            "text": "overhaul.",
            "start": 22.4,
            "end": 23.92
          },
          {
            "text": "Liam",
            "start": 24,
            "end": 25.52
          },
          {
            "text": "here",
            "start": 25.6,
            "end": 27.12
          },
          {
            "text": "kicking",
            "start": 27.2,
            "end": 28.72
          },
          {
            "text": "us",
            "start": 28.8,
            "end": 30.32
          },
          {
            "text": "off.",
            "start": 30.4,
            "end": 31.92
          }
        ]
      },
      {
        "id": "seg-3-002",
        "speakerId": "spk-d1",
        "start": 35,
        "end": 75,
        "text": "Thanks Liam. Chloe here. Today I am presenting the interactive prototype for the redesigned video timeline with embedded highlight pills and speaker presence bars.",
        "words": [
          {
            "text": "Thanks",
            "start": 35,
            "end": 36.58
          },
          {
            "text": "Liam.",
            "start": 36.67,
            "end": 38.25
          },
          {
            "text": "Chloe",
            "start": 38.33,
            "end": 39.92
          },
          {
            "text": "here.",
            "start": 40,
            "end": 41.58
          },
          {
            "text": "Today",
            "start": 41.67,
            "end": 43.25
          },
          {
            "text": "I",
            "start": 43.33,
            "end": 44.92
          },
          {
            "text": "am",
            "start": 45,
            "end": 46.58
          },
          {
            "text": "presenting",
            "start": 46.67,
            "end": 48.25
          },
          {
            "text": "the",
            "start": 48.33,
            "end": 49.92
          },
          {
            "text": "interactive",
            "start": 50,
            "end": 51.58
          },
          {
            "text": "prototype",
            "start": 51.67,
            "end": 53.25
          },
          {
            "text": "for",
            "start": 53.33,
            "end": 54.92
          },
          {
            "text": "the",
            "start": 55,
            "end": 56.58
          },
          {
            "text": "redesigned",
            "start": 56.67,
            "end": 58.25
          },
          {
            "text": "video",
            "start": 58.33,
            "end": 59.92
          },
          {
            "text": "timeline",
            "start": 60,
            "end": 61.58
          },
          {
            "text": "with",
            "start": 61.67,
            "end": 63.25
          },
          {
            "text": "embedded",
            "start": 63.33,
            "end": 64.92
          },
          {
            "text": "highlight",
            "start": 65,
            "end": 66.58
          },
          {
            "text": "pills",
            "start": 66.67,
            "end": 68.25
          },
          {
            "text": "and",
            "start": 68.33,
            "end": 69.92
          },
          {
            "text": "speaker",
            "start": 70,
            "end": 71.58
          },
          {
            "text": "presence",
            "start": 71.67,
            "end": 73.25
          },
          {
            "text": "bars.",
            "start": 73.33,
            "end": 74.92
          }
        ]
      },
      {
        "id": "seg-3-003",
        "speakerId": "spk-d1",
        "start": 78,
        "end": 125,
        "text": "In the current 1.0 player, users complained that scrubbing felt disconnected from the transcript, and finding key moments required reading endless text.",
        "words": [
          {
            "text": "In",
            "start": 78,
            "end": 80.03
          },
          {
            "text": "the",
            "start": 80.14,
            "end": 82.17
          },
          {
            "text": "current",
            "start": 82.27,
            "end": 84.3
          },
          {
            "text": "1.0",
            "start": 84.41,
            "end": 86.44
          },
          {
            "text": "player,",
            "start": 86.55,
            "end": 88.58
          },
          {
            "text": "users",
            "start": 88.68,
            "end": 90.71
          },
          {
            "text": "complained",
            "start": 90.82,
            "end": 92.85
          },
          {
            "text": "that",
            "start": 92.95,
            "end": 94.98
          },
          {
            "text": "scrubbing",
            "start": 95.09,
            "end": 97.12
          },
          {
            "text": "felt",
            "start": 97.23,
            "end": 99.26
          },
          {
            "text": "disconnected",
            "start": 99.36,
            "end": 101.39
          },
          {
            "text": "from",
            "start": 101.5,
            "end": 103.53
          },
          {
            "text": "the",
            "start": 103.64,
            "end": 105.67
          },
          {
            "text": "transcript,",
            "start": 105.77,
            "end": 107.8
          },
          {
            "text": "and",
            "start": 107.91,
            "end": 109.94
          },
          {
            "text": "finding",
            "start": 110.05,
            "end": 112.07
          },
          {
            "text": "key",
            "start": 112.18,
            "end": 114.21
          },
          {
            "text": "moments",
            "start": 114.32,
            "end": 116.35
          },
          {
            "text": "required",
            "start": 116.45,
            "end": 118.48
          },
          {
            "text": "reading",
            "start": 118.59,
            "end": 120.62
          },
          {
            "text": "endless",
            "start": 120.73,
            "end": 122.76
          },
          {
            "text": "text.",
            "start": 122.86,
            "end": 124.89
          }
        ]
      },
      {
        "id": "seg-3-004",
        "speakerId": "spk-d4",
        "start": 128,
        "end": 175,
        "text": "Zoe here. Our usability interviews revealed that eighty-four percent of reviewers want to jump straight to decisions without watching forty minutes of video.",
        "words": [
          {
            "text": "Zoe",
            "start": 128,
            "end": 129.94
          },
          {
            "text": "here.",
            "start": 130.04,
            "end": 131.98
          },
          {
            "text": "Our",
            "start": 132.09,
            "end": 134.03
          },
          {
            "text": "usability",
            "start": 134.13,
            "end": 136.07
          },
          {
            "text": "interviews",
            "start": 136.17,
            "end": 138.12
          },
          {
            "text": "revealed",
            "start": 138.22,
            "end": 140.16
          },
          {
            "text": "that",
            "start": 140.26,
            "end": 142.2
          },
          {
            "text": "eighty-four",
            "start": 142.3,
            "end": 144.25
          },
          {
            "text": "percent",
            "start": 144.35,
            "end": 146.29
          },
          {
            "text": "of",
            "start": 146.39,
            "end": 148.33
          },
          {
            "text": "reviewers",
            "start": 148.43,
            "end": 150.38
          },
          {
            "text": "want",
            "start": 150.48,
            "end": 152.42
          },
          {
            "text": "to",
            "start": 152.52,
            "end": 154.46
          },
          {
            "text": "jump",
            "start": 154.57,
            "end": 156.51
          },
          {
            "text": "straight",
            "start": 156.61,
            "end": 158.55
          },
          {
            "text": "to",
            "start": 158.65,
            "end": 160.59
          },
          {
            "text": "decisions",
            "start": 160.7,
            "end": 162.64
          },
          {
            "text": "without",
            "start": 162.74,
            "end": 164.68
          },
          {
            "text": "watching",
            "start": 164.78,
            "end": 166.72
          },
          {
            "text": "forty",
            "start": 166.83,
            "end": 168.77
          },
          {
            "text": "minutes",
            "start": 168.87,
            "end": 170.81
          },
          {
            "text": "of",
            "start": 170.91,
            "end": 172.85
          },
          {
            "text": "video.",
            "start": 172.96,
            "end": 174.9
          }
        ]
      },
      {
        "id": "seg-3-005",
        "speakerId": "spk-d1",
        "start": 178,
        "end": 230,
        "text": "To address that, we designed the timeline scrubber with colored category markers: purple for decisions, amber for action items, and cyan for key moments.",
        "words": [
          {
            "text": "To",
            "start": 178,
            "end": 180.06
          },
          {
            "text": "address",
            "start": 180.17,
            "end": 182.22
          },
          {
            "text": "that,",
            "start": 182.33,
            "end": 184.39
          },
          {
            "text": "we",
            "start": 184.5,
            "end": 186.56
          },
          {
            "text": "designed",
            "start": 186.67,
            "end": 188.72
          },
          {
            "text": "the",
            "start": 188.83,
            "end": 190.89
          },
          {
            "text": "timeline",
            "start": 191,
            "end": 193.06
          },
          {
            "text": "scrubber",
            "start": 193.17,
            "end": 195.22
          },
          {
            "text": "with",
            "start": 195.33,
            "end": 197.39
          },
          {
            "text": "colored",
            "start": 197.5,
            "end": 199.56
          },
          {
            "text": "category",
            "start": 199.67,
            "end": 201.72
          },
          {
            "text": "markers:",
            "start": 201.83,
            "end": 203.89
          },
          {
            "text": "purple",
            "start": 204,
            "end": 206.06
          },
          {
            "text": "for",
            "start": 206.17,
            "end": 208.22
          },
          {
            "text": "decisions,",
            "start": 208.33,
            "end": 210.39
          },
          {
            "text": "amber",
            "start": 210.5,
            "end": 212.56
          },
          {
            "text": "for",
            "start": 212.67,
            "end": 214.72
          },
          {
            "text": "action",
            "start": 214.83,
            "end": 216.89
          },
          {
            "text": "items,",
            "start": 217,
            "end": 219.06
          },
          {
            "text": "and",
            "start": 219.17,
            "end": 221.22
          },
          {
            "text": "cyan",
            "start": 221.33,
            "end": 223.39
          },
          {
            "text": "for",
            "start": 223.5,
            "end": 225.56
          },
          {
            "text": "key",
            "start": 225.67,
            "end": 227.72
          },
          {
            "text": "moments.",
            "start": 227.83,
            "end": 229.89
          }
        ]
      },
      {
        "id": "seg-3-006",
        "speakerId": "spk-d3",
        "start": 235,
        "end": 285,
        "text": "Kevin here from frontend. How does the scrubber handle hover preview cards? If we render high-resolution thumbnails on every mousemove, we could degrade rendering performance.",
        "words": [
          {
            "text": "Kevin",
            "start": 235,
            "end": 236.9
          },
          {
            "text": "here",
            "start": 237,
            "end": 238.9
          },
          {
            "text": "from",
            "start": 239,
            "end": 240.9
          },
          {
            "text": "frontend.",
            "start": 241,
            "end": 242.9
          },
          {
            "text": "How",
            "start": 243,
            "end": 244.9
          },
          {
            "text": "does",
            "start": 245,
            "end": 246.9
          },
          {
            "text": "the",
            "start": 247,
            "end": 248.9
          },
          {
            "text": "scrubber",
            "start": 249,
            "end": 250.9
          },
          {
            "text": "handle",
            "start": 251,
            "end": 252.9
          },
          {
            "text": "hover",
            "start": 253,
            "end": 254.9
          },
          {
            "text": "preview",
            "start": 255,
            "end": 256.9
          },
          {
            "text": "cards?",
            "start": 257,
            "end": 258.9
          },
          {
            "text": "If",
            "start": 259,
            "end": 260.9
          },
          {
            "text": "we",
            "start": 261,
            "end": 262.9
          },
          {
            "text": "render",
            "start": 263,
            "end": 264.9
          },
          {
            "text": "high-resolution",
            "start": 265,
            "end": 266.9
          },
          {
            "text": "thumbnails",
            "start": 267,
            "end": 268.9
          },
          {
            "text": "on",
            "start": 269,
            "end": 270.9
          },
          {
            "text": "every",
            "start": 271,
            "end": 272.9
          },
          {
            "text": "mousemove,",
            "start": 273,
            "end": 274.9
          },
          {
            "text": "we",
            "start": 275,
            "end": 276.9
          },
          {
            "text": "could",
            "start": 277,
            "end": 278.9
          },
          {
            "text": "degrade",
            "start": 279,
            "end": 280.9
          },
          {
            "text": "rendering",
            "start": 281,
            "end": 282.9
          },
          {
            "text": "performance.",
            "start": 283,
            "end": 284.9
          }
        ]
      },
      {
        "id": "seg-3-007",
        "speakerId": "spk-d1",
        "start": 290,
        "end": 345,
        "text": "We propose generating an indexed sprite sheet of thumbnails at ten-second intervals and displaying a lightweight tooltip card positioned via CSS transforms.",
        "words": [
          {
            "text": "We",
            "start": 290,
            "end": 292.38
          },
          {
            "text": "propose",
            "start": 292.5,
            "end": 294.88
          },
          {
            "text": "generating",
            "start": 295,
            "end": 297.38
          },
          {
            "text": "an",
            "start": 297.5,
            "end": 299.88
          },
          {
            "text": "indexed",
            "start": 300,
            "end": 302.38
          },
          {
            "text": "sprite",
            "start": 302.5,
            "end": 304.88
          },
          {
            "text": "sheet",
            "start": 305,
            "end": 307.38
          },
          {
            "text": "of",
            "start": 307.5,
            "end": 309.88
          },
          {
            "text": "thumbnails",
            "start": 310,
            "end": 312.38
          },
          {
            "text": "at",
            "start": 312.5,
            "end": 314.88
          },
          {
            "text": "ten-second",
            "start": 315,
            "end": 317.38
          },
          {
            "text": "intervals",
            "start": 317.5,
            "end": 319.88
          },
          {
            "text": "and",
            "start": 320,
            "end": 322.38
          },
          {
            "text": "displaying",
            "start": 322.5,
            "end": 324.88
          },
          {
            "text": "a",
            "start": 325,
            "end": 327.38
          },
          {
            "text": "lightweight",
            "start": 327.5,
            "end": 329.88
          },
          {
            "text": "tooltip",
            "start": 330,
            "end": 332.38
          },
          {
            "text": "card",
            "start": 332.5,
            "end": 334.88
          },
          {
            "text": "positioned",
            "start": 335,
            "end": 337.38
          },
          {
            "text": "via",
            "start": 337.5,
            "end": 339.88
          },
          {
            "text": "CSS",
            "start": 340,
            "end": 342.38
          },
          {
            "text": "transforms.",
            "start": 342.5,
            "end": 344.88
          }
        ]
      },
      {
        "id": "seg-3-008",
        "speakerId": "spk-d2",
        "start": 350,
        "end": 405,
        "text": "I love that approach Chloe. That keeps DOM operations minimal while providing instant visual scrubbing feedback.",
        "words": [
          {
            "text": "I",
            "start": 350,
            "end": 353.27
          },
          {
            "text": "love",
            "start": 353.44,
            "end": 356.7
          },
          {
            "text": "that",
            "start": 356.88,
            "end": 360.14
          },
          {
            "text": "approach",
            "start": 360.31,
            "end": 363.58
          },
          {
            "text": "Chloe.",
            "start": 363.75,
            "end": 367.02
          },
          {
            "text": "That",
            "start": 367.19,
            "end": 370.45
          },
          {
            "text": "keeps",
            "start": 370.63,
            "end": 373.89
          },
          {
            "text": "DOM",
            "start": 374.06,
            "end": 377.33
          },
          {
            "text": "operations",
            "start": 377.5,
            "end": 380.77
          },
          {
            "text": "minimal",
            "start": 380.94,
            "end": 384.2
          },
          {
            "text": "while",
            "start": 384.38,
            "end": 387.64
          },
          {
            "text": "providing",
            "start": 387.81,
            "end": 391.08
          },
          {
            "text": "instant",
            "start": 391.25,
            "end": 394.52
          },
          {
            "text": "visual",
            "start": 394.69,
            "end": 397.95
          },
          {
            "text": "scrubbing",
            "start": 398.13,
            "end": 401.39
          },
          {
            "text": "feedback.",
            "start": 401.56,
            "end": 404.83
          }
        ]
      },
      {
        "id": "seg-3-009",
        "speakerId": "spk-d4",
        "start": 410,
        "end": 465,
        "text": "What about keyboard power users? Power users heavily rely on J, K, and L keys for rewind, play/pause, and fast forward.",
        "words": [
          {
            "text": "What",
            "start": 410,
            "end": 412.49
          },
          {
            "text": "about",
            "start": 412.62,
            "end": 415.11
          },
          {
            "text": "keyboard",
            "start": 415.24,
            "end": 417.73
          },
          {
            "text": "power",
            "start": 417.86,
            "end": 420.35
          },
          {
            "text": "users?",
            "start": 420.48,
            "end": 422.96
          },
          {
            "text": "Power",
            "start": 423.1,
            "end": 425.58
          },
          {
            "text": "users",
            "start": 425.71,
            "end": 428.2
          },
          {
            "text": "heavily",
            "start": 428.33,
            "end": 430.82
          },
          {
            "text": "rely",
            "start": 430.95,
            "end": 433.44
          },
          {
            "text": "on",
            "start": 433.57,
            "end": 436.06
          },
          {
            "text": "J,",
            "start": 436.19,
            "end": 438.68
          },
          {
            "text": "K,",
            "start": 438.81,
            "end": 441.3
          },
          {
            "text": "and",
            "start": 441.43,
            "end": 443.92
          },
          {
            "text": "L",
            "start": 444.05,
            "end": 446.54
          },
          {
            "text": "keys",
            "start": 446.67,
            "end": 449.15
          },
          {
            "text": "for",
            "start": 449.29,
            "end": 451.77
          },
          {
            "text": "rewind,",
            "start": 451.9,
            "end": 454.39
          },
          {
            "text": "play/pause,",
            "start": 454.52,
            "end": 457.01
          },
          {
            "text": "and",
            "start": 457.14,
            "end": 459.63
          },
          {
            "text": "fast",
            "start": 459.76,
            "end": 462.25
          },
          {
            "text": "forward.",
            "start": 462.38,
            "end": 464.87
          }
        ]
      },
      {
        "id": "seg-3-010",
        "speakerId": "spk-d3",
        "start": 470,
        "end": 525,
        "text": "We have full keyboard listener support: J rewinds ten seconds, K toggles play/pause, L advances ten seconds, and pressing H creates a highlight bookmark.",
        "words": [
          {
            "text": "We",
            "start": 470,
            "end": 472.18
          },
          {
            "text": "have",
            "start": 472.29,
            "end": 474.47
          },
          {
            "text": "full",
            "start": 474.58,
            "end": 476.76
          },
          {
            "text": "keyboard",
            "start": 476.88,
            "end": 479.05
          },
          {
            "text": "listener",
            "start": 479.17,
            "end": 481.34
          },
          {
            "text": "support:",
            "start": 481.46,
            "end": 483.64
          },
          {
            "text": "J",
            "start": 483.75,
            "end": 485.93
          },
          {
            "text": "rewinds",
            "start": 486.04,
            "end": 488.22
          },
          {
            "text": "ten",
            "start": 488.33,
            "end": 490.51
          },
          {
            "text": "seconds,",
            "start": 490.63,
            "end": 492.8
          },
          {
            "text": "K",
            "start": 492.92,
            "end": 495.09
          },
          {
            "text": "toggles",
            "start": 495.21,
            "end": 497.39
          },
          {
            "text": "play/pause,",
            "start": 497.5,
            "end": 499.68
          },
          {
            "text": "L",
            "start": 499.79,
            "end": 501.97
          },
          {
            "text": "advances",
            "start": 502.08,
            "end": 504.26
          },
          {
            "text": "ten",
            "start": 504.38,
            "end": 506.55
          },
          {
            "text": "seconds,",
            "start": 506.67,
            "end": 508.84
          },
          {
            "text": "and",
            "start": 508.96,
            "end": 511.14
          },
          {
            "text": "pressing",
            "start": 511.25,
            "end": 513.43
          },
          {
            "text": "H",
            "start": 513.54,
            "end": 515.72
          },
          {
            "text": "creates",
            "start": 515.83,
            "end": 518.01
          },
          {
            "text": "a",
            "start": 518.13,
            "end": 520.3
          },
          {
            "text": "highlight",
            "start": 520.42,
            "end": 522.59
          },
          {
            "text": "bookmark.",
            "start": 522.71,
            "end": 524.89
          }
        ]
      },
      {
        "id": "seg-3-011",
        "speakerId": "spk-d4",
        "start": 530,
        "end": 585,
        "text": "During our user testing sessions, participants who discovered the H shortcut created three times more shareable clips than those using mouse clicks.",
        "words": [
          {
            "text": "During",
            "start": 530,
            "end": 532.38
          },
          {
            "text": "our",
            "start": 532.5,
            "end": 534.88
          },
          {
            "text": "user",
            "start": 535,
            "end": 537.38
          },
          {
            "text": "testing",
            "start": 537.5,
            "end": 539.88
          },
          {
            "text": "sessions,",
            "start": 540,
            "end": 542.38
          },
          {
            "text": "participants",
            "start": 542.5,
            "end": 544.88
          },
          {
            "text": "who",
            "start": 545,
            "end": 547.38
          },
          {
            "text": "discovered",
            "start": 547.5,
            "end": 549.88
          },
          {
            "text": "the",
            "start": 550,
            "end": 552.38
          },
          {
            "text": "H",
            "start": 552.5,
            "end": 554.88
          },
          {
            "text": "shortcut",
            "start": 555,
            "end": 557.38
          },
          {
            "text": "created",
            "start": 557.5,
            "end": 559.88
          },
          {
            "text": "three",
            "start": 560,
            "end": 562.38
          },
          {
            "text": "times",
            "start": 562.5,
            "end": 564.88
          },
          {
            "text": "more",
            "start": 565,
            "end": 567.38
          },
          {
            "text": "shareable",
            "start": 567.5,
            "end": 569.88
          },
          {
            "text": "clips",
            "start": 570,
            "end": 572.38
          },
          {
            "text": "than",
            "start": 572.5,
            "end": 574.88
          },
          {
            "text": "those",
            "start": 575,
            "end": 577.38
          },
          {
            "text": "using",
            "start": 577.5,
            "end": 579.88
          },
          {
            "text": "mouse",
            "start": 580,
            "end": 582.38
          },
          {
            "text": "clicks.",
            "start": 582.5,
            "end": 584.88
          }
        ]
      },
      {
        "id": "seg-3-012",
        "speakerId": "spk-d1",
        "start": 590,
        "end": 645,
        "text": "That is fantastic validation. Chloe will update the Figma component library with the revised hover preview card and keyboard shortcut tooltip hints.",
        "words": [
          {
            "text": "That",
            "start": 590,
            "end": 592.38
          },
          {
            "text": "is",
            "start": 592.5,
            "end": 594.88
          },
          {
            "text": "fantastic",
            "start": 595,
            "end": 597.38
          },
          {
            "text": "validation.",
            "start": 597.5,
            "end": 599.88
          },
          {
            "text": "Chloe",
            "start": 600,
            "end": 602.38
          },
          {
            "text": "will",
            "start": 602.5,
            "end": 604.88
          },
          {
            "text": "update",
            "start": 605,
            "end": 607.38
          },
          {
            "text": "the",
            "start": 607.5,
            "end": 609.88
          },
          {
            "text": "Figma",
            "start": 610,
            "end": 612.38
          },
          {
            "text": "component",
            "start": 612.5,
            "end": 614.88
          },
          {
            "text": "library",
            "start": 615,
            "end": 617.38
          },
          {
            "text": "with",
            "start": 617.5,
            "end": 619.88
          },
          {
            "text": "the",
            "start": 620,
            "end": 622.38
          },
          {
            "text": "revised",
            "start": 622.5,
            "end": 624.88
          },
          {
            "text": "hover",
            "start": 625,
            "end": 627.38
          },
          {
            "text": "preview",
            "start": 627.5,
            "end": 629.88
          },
          {
            "text": "card",
            "start": 630,
            "end": 632.38
          },
          {
            "text": "and",
            "start": 632.5,
            "end": 634.88
          },
          {
            "text": "keyboard",
            "start": 635,
            "end": 637.38
          },
          {
            "text": "shortcut",
            "start": 637.5,
            "end": 639.88
          },
          {
            "text": "tooltip",
            "start": 640,
            "end": 642.38
          },
          {
            "text": "hints.",
            "start": 642.5,
            "end": 644.88
          }
        ]
      },
      {
        "id": "seg-3-013",
        "speakerId": "spk-d3",
        "start": 650,
        "end": 710,
        "text": "On the frontend side, I will benchmark the canvas scrubber rendering performance under sixty frames per second to ensure zero stutter during rapid drags.",
        "words": [
          {
            "text": "On",
            "start": 650,
            "end": 652.38
          },
          {
            "text": "the",
            "start": 652.5,
            "end": 654.88
          },
          {
            "text": "frontend",
            "start": 655,
            "end": 657.38
          },
          {
            "text": "side,",
            "start": 657.5,
            "end": 659.88
          },
          {
            "text": "I",
            "start": 660,
            "end": 662.38
          },
          {
            "text": "will",
            "start": 662.5,
            "end": 664.88
          },
          {
            "text": "benchmark",
            "start": 665,
            "end": 667.38
          },
          {
            "text": "the",
            "start": 667.5,
            "end": 669.88
          },
          {
            "text": "canvas",
            "start": 670,
            "end": 672.38
          },
          {
            "text": "scrubber",
            "start": 672.5,
            "end": 674.88
          },
          {
            "text": "rendering",
            "start": 675,
            "end": 677.38
          },
          {
            "text": "performance",
            "start": 677.5,
            "end": 679.88
          },
          {
            "text": "under",
            "start": 680,
            "end": 682.38
          },
          {
            "text": "sixty",
            "start": 682.5,
            "end": 684.88
          },
          {
            "text": "frames",
            "start": 685,
            "end": 687.38
          },
          {
            "text": "per",
            "start": 687.5,
            "end": 689.88
          },
          {
            "text": "second",
            "start": 690,
            "end": 692.38
          },
          {
            "text": "to",
            "start": 692.5,
            "end": 694.88
          },
          {
            "text": "ensure",
            "start": 695,
            "end": 697.38
          },
          {
            "text": "zero",
            "start": 697.5,
            "end": 699.88
          },
          {
            "text": "stutter",
            "start": 700,
            "end": 702.38
          },
          {
            "text": "during",
            "start": 702.5,
            "end": 704.88
          },
          {
            "text": "rapid",
            "start": 705,
            "end": 707.38
          },
          {
            "text": "drags.",
            "start": 707.5,
            "end": 709.88
          }
        ]
      },
      {
        "id": "seg-3-014",
        "speakerId": "spk-d2",
        "start": 715,
        "end": 775,
        "text": "Let's also examine the speaker presence bar located right below the video player. How do users interact with talk-time distribution?",
        "words": [
          {
            "text": "Let's",
            "start": 715,
            "end": 717.85
          },
          {
            "text": "also",
            "start": 718,
            "end": 720.85
          },
          {
            "text": "examine",
            "start": 721,
            "end": 723.85
          },
          {
            "text": "the",
            "start": 724,
            "end": 726.85
          },
          {
            "text": "speaker",
            "start": 727,
            "end": 729.85
          },
          {
            "text": "presence",
            "start": 730,
            "end": 732.85
          },
          {
            "text": "bar",
            "start": 733,
            "end": 735.85
          },
          {
            "text": "located",
            "start": 736,
            "end": 738.85
          },
          {
            "text": "right",
            "start": 739,
            "end": 741.85
          },
          {
            "text": "below",
            "start": 742,
            "end": 744.85
          },
          {
            "text": "the",
            "start": 745,
            "end": 747.85
          },
          {
            "text": "video",
            "start": 748,
            "end": 750.85
          },
          {
            "text": "player.",
            "start": 751,
            "end": 753.85
          },
          {
            "text": "How",
            "start": 754,
            "end": 756.85
          },
          {
            "text": "do",
            "start": 757,
            "end": 759.85
          },
          {
            "text": "users",
            "start": 760,
            "end": 762.85
          },
          {
            "text": "interact",
            "start": 763,
            "end": 765.85
          },
          {
            "text": "with",
            "start": 766,
            "end": 768.85
          },
          {
            "text": "talk-time",
            "start": 769,
            "end": 771.85
          },
          {
            "text": "distribution?",
            "start": 772,
            "end": 774.85
          }
        ]
      },
      {
        "id": "seg-3-015",
        "speakerId": "spk-d1",
        "start": 780,
        "end": 840,
        "text": "Clicking any participant avatar filters the entire transcript to show only their spoken segments, with an animated clear-filter button.",
        "words": [
          {
            "text": "Clicking",
            "start": 780,
            "end": 783
          },
          {
            "text": "any",
            "start": 783.16,
            "end": 786.16
          },
          {
            "text": "participant",
            "start": 786.32,
            "end": 789.32
          },
          {
            "text": "avatar",
            "start": 789.47,
            "end": 792.47
          },
          {
            "text": "filters",
            "start": 792.63,
            "end": 795.63
          },
          {
            "text": "the",
            "start": 795.79,
            "end": 798.79
          },
          {
            "text": "entire",
            "start": 798.95,
            "end": 801.95
          },
          {
            "text": "transcript",
            "start": 802.11,
            "end": 805.11
          },
          {
            "text": "to",
            "start": 805.26,
            "end": 808.26
          },
          {
            "text": "show",
            "start": 808.42,
            "end": 811.42
          },
          {
            "text": "only",
            "start": 811.58,
            "end": 814.58
          },
          {
            "text": "their",
            "start": 814.74,
            "end": 817.74
          },
          {
            "text": "spoken",
            "start": 817.89,
            "end": 820.89
          },
          {
            "text": "segments,",
            "start": 821.05,
            "end": 824.05
          },
          {
            "text": "with",
            "start": 824.21,
            "end": 827.21
          },
          {
            "text": "an",
            "start": 827.37,
            "end": 830.37
          },
          {
            "text": "animated",
            "start": 830.53,
            "end": 833.53
          },
          {
            "text": "clear-filter",
            "start": 833.68,
            "end": 836.68
          },
          {
            "text": "button.",
            "start": 836.84,
            "end": 839.84
          }
        ]
      },
      {
        "id": "seg-3-016",
        "speakerId": "spk-d4",
        "start": 845,
        "end": 905,
        "text": "Zoe will conduct five additional usability test sessions focused specifically on the discoverability of the speaker filter and keyboard shortcuts.",
        "words": [
          {
            "text": "Zoe",
            "start": 845,
            "end": 847.85
          },
          {
            "text": "will",
            "start": 848,
            "end": 850.85
          },
          {
            "text": "conduct",
            "start": 851,
            "end": 853.85
          },
          {
            "text": "five",
            "start": 854,
            "end": 856.85
          },
          {
            "text": "additional",
            "start": 857,
            "end": 859.85
          },
          {
            "text": "usability",
            "start": 860,
            "end": 862.85
          },
          {
            "text": "test",
            "start": 863,
            "end": 865.85
          },
          {
            "text": "sessions",
            "start": 866,
            "end": 868.85
          },
          {
            "text": "focused",
            "start": 869,
            "end": 871.85
          },
          {
            "text": "specifically",
            "start": 872,
            "end": 874.85
          },
          {
            "text": "on",
            "start": 875,
            "end": 877.85
          },
          {
            "text": "the",
            "start": 878,
            "end": 880.85
          },
          {
            "text": "discoverability",
            "start": 881,
            "end": 883.85
          },
          {
            "text": "of",
            "start": 884,
            "end": 886.85
          },
          {
            "text": "the",
            "start": 887,
            "end": 889.85
          },
          {
            "text": "speaker",
            "start": 890,
            "end": 892.85
          },
          {
            "text": "filter",
            "start": 893,
            "end": 895.85
          },
          {
            "text": "and",
            "start": 896,
            "end": 898.85
          },
          {
            "text": "keyboard",
            "start": 899,
            "end": 901.85
          },
          {
            "text": "shortcuts.",
            "start": 902,
            "end": 904.85
          }
        ]
      },
      {
        "id": "seg-3-017",
        "speakerId": "spk-d3",
        "start": 910,
        "end": 970,
        "text": "We will also add an auto-scroll lock button so that when a user manually scrolls the transcript, it does not jarringly jump back to the video playhead.",
        "words": [
          {
            "text": "We",
            "start": 910,
            "end": 912.11
          },
          {
            "text": "will",
            "start": 912.22,
            "end": 914.33
          },
          {
            "text": "also",
            "start": 914.44,
            "end": 916.56
          },
          {
            "text": "add",
            "start": 916.67,
            "end": 918.78
          },
          {
            "text": "an",
            "start": 918.89,
            "end": 921
          },
          {
            "text": "auto-scroll",
            "start": 921.11,
            "end": 923.22
          },
          {
            "text": "lock",
            "start": 923.33,
            "end": 925.44
          },
          {
            "text": "button",
            "start": 925.56,
            "end": 927.67
          },
          {
            "text": "so",
            "start": 927.78,
            "end": 929.89
          },
          {
            "text": "that",
            "start": 930,
            "end": 932.11
          },
          {
            "text": "when",
            "start": 932.22,
            "end": 934.33
          },
          {
            "text": "a",
            "start": 934.44,
            "end": 936.56
          },
          {
            "text": "user",
            "start": 936.67,
            "end": 938.78
          },
          {
            "text": "manually",
            "start": 938.89,
            "end": 941
          },
          {
            "text": "scrolls",
            "start": 941.11,
            "end": 943.22
          },
          {
            "text": "the",
            "start": 943.33,
            "end": 945.44
          },
          {
            "text": "transcript,",
            "start": 945.56,
            "end": 947.67
          },
          {
            "text": "it",
            "start": 947.78,
            "end": 949.89
          },
          {
            "text": "does",
            "start": 950,
            "end": 952.11
          },
          {
            "text": "not",
            "start": 952.22,
            "end": 954.33
          },
          {
            "text": "jarringly",
            "start": 954.44,
            "end": 956.56
          },
          {
            "text": "jump",
            "start": 956.67,
            "end": 958.78
          },
          {
            "text": "back",
            "start": 958.89,
            "end": 961
          },
          {
            "text": "to",
            "start": 961.11,
            "end": 963.22
          },
          {
            "text": "the",
            "start": 963.33,
            "end": 965.44
          },
          {
            "text": "video",
            "start": 965.56,
            "end": 967.67
          },
          {
            "text": "playhead.",
            "start": 967.78,
            "end": 969.89
          }
        ]
      },
      {
        "id": "seg-3-018",
        "speakerId": "spk-d2",
        "start": 975,
        "end": 1035,
        "text": "Great addition Kevin. I will finalize the engineering acceptance criteria for the 2.0 scrubber milestone and schedule the kickoff.",
        "words": [
          {
            "text": "Great",
            "start": 975,
            "end": 978
          },
          {
            "text": "addition",
            "start": 978.16,
            "end": 981.16
          },
          {
            "text": "Kevin.",
            "start": 981.32,
            "end": 984.32
          },
          {
            "text": "I",
            "start": 984.47,
            "end": 987.47
          },
          {
            "text": "will",
            "start": 987.63,
            "end": 990.63
          },
          {
            "text": "finalize",
            "start": 990.79,
            "end": 993.79
          },
          {
            "text": "the",
            "start": 993.95,
            "end": 996.95
          },
          {
            "text": "engineering",
            "start": 997.11,
            "end": 1000.11
          },
          {
            "text": "acceptance",
            "start": 1000.26,
            "end": 1003.26
          },
          {
            "text": "criteria",
            "start": 1003.42,
            "end": 1006.42
          },
          {
            "text": "for",
            "start": 1006.58,
            "end": 1009.58
          },
          {
            "text": "the",
            "start": 1009.74,
            "end": 1012.74
          },
          {
            "text": "2.0",
            "start": 1012.89,
            "end": 1015.89
          },
          {
            "text": "scrubber",
            "start": 1016.05,
            "end": 1019.05
          },
          {
            "text": "milestone",
            "start": 1019.21,
            "end": 1022.21
          },
          {
            "text": "and",
            "start": 1022.37,
            "end": 1025.37
          },
          {
            "text": "schedule",
            "start": 1025.53,
            "end": 1028.53
          },
          {
            "text": "the",
            "start": 1028.68,
            "end": 1031.68
          },
          {
            "text": "kickoff.",
            "start": 1031.84,
            "end": 1034.84
          }
        ]
      },
      {
        "id": "seg-3-019",
        "speakerId": "spk-d1",
        "start": 1040,
        "end": 1100,
        "text": "Awesome critique everyone. We have solid alignment on design, performance, and user research. Let's build it!",
        "words": [
          {
            "text": "Awesome",
            "start": 1040,
            "end": 1043.56
          },
          {
            "text": "critique",
            "start": 1043.75,
            "end": 1047.31
          },
          {
            "text": "everyone.",
            "start": 1047.5,
            "end": 1051.06
          },
          {
            "text": "We",
            "start": 1051.25,
            "end": 1054.81
          },
          {
            "text": "have",
            "start": 1055,
            "end": 1058.56
          },
          {
            "text": "solid",
            "start": 1058.75,
            "end": 1062.31
          },
          {
            "text": "alignment",
            "start": 1062.5,
            "end": 1066.06
          },
          {
            "text": "on",
            "start": 1066.25,
            "end": 1069.81
          },
          {
            "text": "design,",
            "start": 1070,
            "end": 1073.56
          },
          {
            "text": "performance,",
            "start": 1073.75,
            "end": 1077.31
          },
          {
            "text": "and",
            "start": 1077.5,
            "end": 1081.06
          },
          {
            "text": "user",
            "start": 1081.25,
            "end": 1084.81
          },
          {
            "text": "research.",
            "start": 1085,
            "end": 1088.56
          },
          {
            "text": "Let's",
            "start": 1088.75,
            "end": 1092.31
          },
          {
            "text": "build",
            "start": 1092.5,
            "end": 1096.06
          },
          {
            "text": "it!",
            "start": 1096.25,
            "end": 1099.81
          }
        ]
      }
    ],
    "highlights": [
      {
        "id": "hl-3-1",
        "meetingId": "meeting-3",
        "title": "Scrubber Thumbnail Tooltip Sprite Architecture",
        "start": 290,
        "end": 350,
        "category": "decision",
        "color": "#8B5CF6",
        "createdAt": "2026-09-10T10:05:00.000Z"
      },
      {
        "id": "hl-3-2",
        "meetingId": "meeting-3",
        "title": "Keyboard Shortcuts (J/K/L/H) Drive 3x More Highlight Clips",
        "start": 510,
        "end": 580,
        "category": "key_moment",
        "color": "#10B981",
        "createdAt": "2026-09-10T10:09:00.000Z"
      },
      {
        "id": "hl-3-3",
        "meetingId": "meeting-3",
        "title": "Auto-Scroll Locking Mechanism Approved",
        "start": 950,
        "end": 1010,
        "category": "action",
        "color": "#3B82F6",
        "createdAt": "2026-09-10T10:16:30.000Z"
      }
    ],
    "actionItems": [
      {
        "id": "act-3-1",
        "meetingId": "meeting-3",
        "meetingTitle": "Fathom 2.0 Video Scrubber & Navigation Redesign",
        "text": "Update Figma component library with revised hover preview card and keyboard shortcut tooltip hints",
        "assigneeId": "spk-d1",
        "completed": true,
        "timestamp": 320,
        "priority": "high",
        "dueDate": "2026-09-14"
      },
      {
        "id": "act-3-2",
        "meetingId": "meeting-3",
        "meetingTitle": "Fathom 2.0 Video Scrubber & Navigation Redesign",
        "text": "Benchmark canvas scrubber rendering performance under 60fps during high-frequency mouse drag",
        "assigneeId": "spk-d3",
        "completed": false,
        "timestamp": 680,
        "priority": "high",
        "dueDate": "2026-09-16"
      },
      {
        "id": "act-3-3",
        "meetingId": "meeting-3",
        "meetingTitle": "Fathom 2.0 Video Scrubber & Navigation Redesign",
        "text": "Conduct 5 additional usability test sessions on speaker presence bar discoverability and 'H' hotkey",
        "assigneeId": "spk-d4",
        "completed": false,
        "timestamp": 880,
        "priority": "medium",
        "dueDate": "2026-09-18"
      },
      {
        "id": "act-3-4",
        "meetingId": "meeting-3",
        "meetingTitle": "Fathom 2.0 Video Scrubber & Navigation Redesign",
        "text": "Finalize engineering acceptance criteria for Fathom 2.0 scrubber milestone and schedule kickoff",
        "assigneeId": "spk-d2",
        "completed": false,
        "timestamp": 1020,
        "priority": "medium",
        "dueDate": "2026-09-15"
      }
    ],
    "summaries": {
      "executive": {
        "id": "executive",
        "name": "Executive Summary",
        "icon": "Briefcase",
        "overview": "Product design critique reviewing the redesigned 2.0 video timeline scrubber, interactive speaker presence bar, and keyboard navigation shortcuts. User research confirmed that 84% of reviewers skip directly to decisions rather than watching entire recordings. The team approved hover thumbnail previews using lightweight CSS transforms, confirmed J/K/L and 'H' hotkey bindings, and introduced an auto-scroll lock button to prevent jarring transcript jumps.",
        "sections": [
          {
            "title": "UX Research Findings & Timeline Markers",
            "bullets": [
              "84% of users want direct visual indicators for decisions, action items, and key moments along the timeline.",
              "Color-coded timeline pills approved: purple for decisions, emerald for action items, cyan for key moments, red for risks."
            ],
            "timestampRefs": [
              {
                "text": "User research findings",
                "time": 128
              },
              {
                "text": "Color-coded category markers",
                "time": 178
              }
            ]
          },
          {
            "title": "Keyboard-First Navigation & Clip Creation",
            "bullets": [
              "Power user shortcuts confirmed: J (rewind 10s), K (play/pause), L (fast forward 10s), H (bookmark highlight).",
              "Usability tests proved users utilizing the 'H' hotkey created 3x more shareable clips than mouse-only users."
            ],
            "timestampRefs": [
              {
                "text": "J/K/L keyboard support",
                "time": 470
              },
              {
                "text": "Highlight hotkey adoption",
                "time": 530
              }
            ]
          },
          {
            "title": "Performance & Speaker Filtering",
            "bullets": [
              "Canvas-based scrubber dragging benchmarked to maintain smooth 60fps without DOM reflow.",
              "Speaker presence bar enables 1-click filtering of transcripts by participant talk-time with auto-scroll locking."
            ],
            "timestampRefs": [
              {
                "text": "Speaker presence bar",
                "time": 780
              },
              {
                "text": "Auto-scroll lock mechanism",
                "time": 910
              }
            ]
          }
        ]
      },
      "action_items": {
        "id": "action_items",
        "name": "Action Items & Next Steps",
        "icon": "CheckSquare",
        "overview": "Design, frontend, and research action items for the 2.0 scrubber milestone.",
        "sections": [
          {
            "title": "Design & UX Research",
            "bullets": [
              "Chloe Dubois: Update Figma component library with revised hover preview card and keyboard shortcut hints (Due: Sep 14).",
              "Zoe Anderson: Conduct 5 additional usability test sessions on speaker presence bar discoverability (Due: Sep 18)."
            ],
            "timestampRefs": [
              {
                "text": "Chloe Figma update",
                "time": 590
              },
              {
                "text": "Zoe user testing",
                "time": 845
              }
            ]
          },
          {
            "title": "Frontend Engineering & Acceptance Criteria",
            "bullets": [
              "Kevin Zhang: Benchmark canvas scrubber rendering performance under 60fps during rapid mouse drag (Due: Sep 16).",
              "Liam O'Connor: Finalize engineering acceptance criteria for 2.0 scrubber milestone and schedule kickoff (Due: Sep 15)."
            ],
            "timestampRefs": [
              {
                "text": "Kevin performance benchmark",
                "time": 650
              },
              {
                "text": "Liam acceptance criteria",
                "time": 975
              }
            ]
          }
        ]
      },
      "sales": {
        "id": "sales",
        "name": "Sales & Customer Impact",
        "icon": "TrendingUp",
        "overview": "Productivity features improving end-user viral sharing loops and user retention.",
        "sections": [
          {
            "title": "Viral Growth & Shareable Clips",
            "bullets": [
              "One-click highlight clipping via the 'H' key and text selection popover powers Fathom's viral share loop.",
              "Shared clips embed responsive preview cards on Slack and Notion, driving prospective customer acquisition."
            ],
            "timestampRefs": [
              {
                "text": "Viral clip creation",
                "time": 530
              }
            ]
          }
        ]
      },
      "engineering": {
        "id": "engineering",
        "name": "Engineering & Architecture Notes",
        "icon": "Cpu",
        "overview": "Frontend rendering strategies and keyboard event orchestration details.",
        "sections": [
          {
            "title": "Video Scrubber Canvas Engine",
            "bullets": [
              "Progress bar rendering optimized using HTML5 Canvas to eliminate excessive React re-renders during high-frequency scrubbing.",
              "Hover thumbnails served via indexed sprite sheet with CSS background-position offsets."
            ],
            "timestampRefs": [
              {
                "text": "Sprite sheet thumbnails",
                "time": 290
              },
              {
                "text": "Canvas 60fps rendering",
                "time": 650
              }
            ]
          },
          {
            "title": "Scroll Management & State Sync",
            "bullets": [
              "Auto-scroll lock flag decoupled from video playhead time updates so manual user scroll never resets.",
              "Zustand state store dispatches seek events with debounced audio/video element time syncing."
            ],
            "timestampRefs": [
              {
                "text": "Auto-scroll lock decoupling",
                "time": 910
              }
            ]
          }
        ]
      }
    },
    "tags": [
      "Product",
      "Design",
      "UX",
      "Scrubber",
      "Critique"
    ]
  },
  {
    "id": "meeting-4",
    "title": "Engineering Career Growth & Feedback",
    "date": "2026-09-09T15:00:00.000Z",
    "duration": 900,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "participants": [
      {
        "id": "spk-m1",
        "name": "David Miller",
        "role": "Engineering Director",
        "company": "Fathom Engineering",
        "color": "#3B82F6",
        "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        "id": "spk-m2",
        "name": "Emily Watson",
        "role": "Senior Software Engineer",
        "company": "Fathom Engineering",
        "color": "#F59E0B",
        "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      }
    ],
    "transcript": [
      {
        "id": "seg-4-001",
        "speakerId": "spk-m1",
        "start": 0,
        "end": 37,
        "text": "Hey Emily, thanks for jumping on our bi-weekly one-on-one. How are you feeling after shipping the websocket ingestion pipeline last week?",
        "words": [
          {
            "text": "Hey",
            "start": 0,
            "end": 1.67
          },
          {
            "text": "Emily,",
            "start": 1.76,
            "end": 3.44
          },
          {
            "text": "thanks",
            "start": 3.52,
            "end": 5.2
          },
          {
            "text": "for",
            "start": 5.29,
            "end": 6.96
          },
          {
            "text": "jumping",
            "start": 7.05,
            "end": 8.72
          },
          {
            "text": "on",
            "start": 8.81,
            "end": 10.48
          },
          {
            "text": "our",
            "start": 10.57,
            "end": 12.25
          },
          {
            "text": "bi-weekly",
            "start": 12.33,
            "end": 14.01
          },
          {
            "text": "one-on-one.",
            "start": 14.1,
            "end": 15.77
          },
          {
            "text": "How",
            "start": 15.86,
            "end": 17.53
          },
          {
            "text": "are",
            "start": 17.62,
            "end": 19.29
          },
          {
            "text": "you",
            "start": 19.38,
            "end": 21.05
          },
          {
            "text": "feeling",
            "start": 21.14,
            "end": 22.82
          },
          {
            "text": "after",
            "start": 22.9,
            "end": 24.58
          },
          {
            "text": "shipping",
            "start": 24.67,
            "end": 26.34
          },
          {
            "text": "the",
            "start": 26.43,
            "end": 28.1
          },
          {
            "text": "websocket",
            "start": 28.19,
            "end": 29.86
          },
          {
            "text": "ingestion",
            "start": 29.95,
            "end": 31.63
          },
          {
            "text": "pipeline",
            "start": 31.71,
            "end": 33.39
          },
          {
            "text": "last",
            "start": 33.48,
            "end": 35.15
          },
          {
            "text": "week?",
            "start": 35.24,
            "end": 36.91
          }
        ]
      },
      {
        "id": "seg-4-002",
        "speakerId": "spk-m2",
        "start": 40,
        "end": 84,
        "text": "Hey David! Honestly feeling great. The ingestion pipeline has been running in production with zero errors and p99 latency dropped by thirty percent.",
        "words": [
          {
            "text": "Hey",
            "start": 40,
            "end": 41.82
          },
          {
            "text": "David!",
            "start": 41.91,
            "end": 43.73
          },
          {
            "text": "Honestly",
            "start": 43.83,
            "end": 45.64
          },
          {
            "text": "feeling",
            "start": 45.74,
            "end": 47.56
          },
          {
            "text": "great.",
            "start": 47.65,
            "end": 49.47
          },
          {
            "text": "The",
            "start": 49.57,
            "end": 51.38
          },
          {
            "text": "ingestion",
            "start": 51.48,
            "end": 53.3
          },
          {
            "text": "pipeline",
            "start": 53.39,
            "end": 55.21
          },
          {
            "text": "has",
            "start": 55.3,
            "end": 57.12
          },
          {
            "text": "been",
            "start": 57.22,
            "end": 59.03
          },
          {
            "text": "running",
            "start": 59.13,
            "end": 60.95
          },
          {
            "text": "in",
            "start": 61.04,
            "end": 62.86
          },
          {
            "text": "production",
            "start": 62.96,
            "end": 64.77
          },
          {
            "text": "with",
            "start": 64.87,
            "end": 66.69
          },
          {
            "text": "zero",
            "start": 66.78,
            "end": 68.6
          },
          {
            "text": "errors",
            "start": 68.7,
            "end": 70.51
          },
          {
            "text": "and",
            "start": 70.61,
            "end": 72.43
          },
          {
            "text": "p99",
            "start": 72.52,
            "end": 74.34
          },
          {
            "text": "latency",
            "start": 74.43,
            "end": 76.25
          },
          {
            "text": "dropped",
            "start": 76.35,
            "end": 78.17
          },
          {
            "text": "by",
            "start": 78.26,
            "end": 80.08
          },
          {
            "text": "thirty",
            "start": 80.17,
            "end": 81.99
          },
          {
            "text": "percent.",
            "start": 82.09,
            "end": 83.9
          }
        ]
      },
      {
        "id": "seg-4-003",
        "speakerId": "spk-m1",
        "start": 88,
        "end": 137,
        "text": "That was exceptional execution. The platform team and Priya were raving about how seamless the migration was. You really owned the end-to-end delivery.",
        "words": [
          {
            "text": "That",
            "start": 88,
            "end": 90.02
          },
          {
            "text": "was",
            "start": 90.13,
            "end": 92.15
          },
          {
            "text": "exceptional",
            "start": 92.26,
            "end": 94.28
          },
          {
            "text": "execution.",
            "start": 94.39,
            "end": 96.42
          },
          {
            "text": "The",
            "start": 96.52,
            "end": 98.55
          },
          {
            "text": "platform",
            "start": 98.65,
            "end": 100.68
          },
          {
            "text": "team",
            "start": 100.78,
            "end": 102.81
          },
          {
            "text": "and",
            "start": 102.91,
            "end": 104.94
          },
          {
            "text": "Priya",
            "start": 105.04,
            "end": 107.07
          },
          {
            "text": "were",
            "start": 107.17,
            "end": 109.2
          },
          {
            "text": "raving",
            "start": 109.3,
            "end": 111.33
          },
          {
            "text": "about",
            "start": 111.43,
            "end": 113.46
          },
          {
            "text": "how",
            "start": 113.57,
            "end": 115.59
          },
          {
            "text": "seamless",
            "start": 115.7,
            "end": 117.72
          },
          {
            "text": "the",
            "start": 117.83,
            "end": 119.85
          },
          {
            "text": "migration",
            "start": 119.96,
            "end": 121.98
          },
          {
            "text": "was.",
            "start": 122.09,
            "end": 124.11
          },
          {
            "text": "You",
            "start": 124.22,
            "end": 126.24
          },
          {
            "text": "really",
            "start": 126.35,
            "end": 128.37
          },
          {
            "text": "owned",
            "start": 128.48,
            "end": 130.5
          },
          {
            "text": "the",
            "start": 130.61,
            "end": 132.63
          },
          {
            "text": "end-to-end",
            "start": 132.74,
            "end": 134.76
          },
          {
            "text": "delivery.",
            "start": 134.87,
            "end": 136.89
          }
        ]
      },
      {
        "id": "seg-4-004",
        "speakerId": "spk-m2",
        "start": 141,
        "end": 195,
        "text": "Thank you! I learned a lot about distributed state synchronization and dealing with backpressure during traffic spikes.",
        "words": [
          {
            "text": "Thank",
            "start": 141,
            "end": 144.02
          },
          {
            "text": "you!",
            "start": 144.18,
            "end": 147.19
          },
          {
            "text": "I",
            "start": 147.35,
            "end": 150.37
          },
          {
            "text": "learned",
            "start": 150.53,
            "end": 153.55
          },
          {
            "text": "a",
            "start": 153.71,
            "end": 156.72
          },
          {
            "text": "lot",
            "start": 156.88,
            "end": 159.9
          },
          {
            "text": "about",
            "start": 160.06,
            "end": 163.08
          },
          {
            "text": "distributed",
            "start": 163.24,
            "end": 166.25
          },
          {
            "text": "state",
            "start": 166.41,
            "end": 169.43
          },
          {
            "text": "synchronization",
            "start": 169.59,
            "end": 172.61
          },
          {
            "text": "and",
            "start": 172.76,
            "end": 175.78
          },
          {
            "text": "dealing",
            "start": 175.94,
            "end": 178.96
          },
          {
            "text": "with",
            "start": 179.12,
            "end": 182.14
          },
          {
            "text": "backpressure",
            "start": 182.29,
            "end": 185.31
          },
          {
            "text": "during",
            "start": 185.47,
            "end": 188.49
          },
          {
            "text": "traffic",
            "start": 188.65,
            "end": 191.66
          },
          {
            "text": "spikes.",
            "start": 191.82,
            "end": 194.84
          }
        ]
      },
      {
        "id": "seg-4-005",
        "speakerId": "spk-m1",
        "start": 201,
        "end": 259,
        "text": "Today I want to focus on your career trajectory. In our last review, you mentioned wanting to target promotion to Staff Software Engineer.",
        "words": [
          {
            "text": "Today",
            "start": 201,
            "end": 203.4
          },
          {
            "text": "I",
            "start": 203.52,
            "end": 205.92
          },
          {
            "text": "want",
            "start": 206.04,
            "end": 208.44
          },
          {
            "text": "to",
            "start": 208.57,
            "end": 210.96
          },
          {
            "text": "focus",
            "start": 211.09,
            "end": 213.48
          },
          {
            "text": "on",
            "start": 213.61,
            "end": 216
          },
          {
            "text": "your",
            "start": 216.13,
            "end": 218.53
          },
          {
            "text": "career",
            "start": 218.65,
            "end": 221.05
          },
          {
            "text": "trajectory.",
            "start": 221.17,
            "end": 223.57
          },
          {
            "text": "In",
            "start": 223.7,
            "end": 226.09
          },
          {
            "text": "our",
            "start": 226.22,
            "end": 228.61
          },
          {
            "text": "last",
            "start": 228.74,
            "end": 231.13
          },
          {
            "text": "review,",
            "start": 231.26,
            "end": 233.66
          },
          {
            "text": "you",
            "start": 233.78,
            "end": 236.18
          },
          {
            "text": "mentioned",
            "start": 236.3,
            "end": 238.7
          },
          {
            "text": "wanting",
            "start": 238.83,
            "end": 241.22
          },
          {
            "text": "to",
            "start": 241.35,
            "end": 243.74
          },
          {
            "text": "target",
            "start": 243.87,
            "end": 246.27
          },
          {
            "text": "promotion",
            "start": 246.39,
            "end": 248.79
          },
          {
            "text": "to",
            "start": 248.91,
            "end": 251.31
          },
          {
            "text": "Staff",
            "start": 251.43,
            "end": 253.83
          },
          {
            "text": "Software",
            "start": 253.96,
            "end": 256.35
          },
          {
            "text": "Engineer.",
            "start": 256.48,
            "end": 258.87
          }
        ]
      },
      {
        "id": "seg-4-006",
        "speakerId": "spk-m2",
        "start": 264,
        "end": 328,
        "text": "Yes, absolutely David. I want to expand beyond single-service implementation and lead architectural design across our core distributed infrastructure.",
        "words": [
          {
            "text": "Yes,",
            "start": 264,
            "end": 267.2
          },
          {
            "text": "absolutely",
            "start": 267.37,
            "end": 270.57
          },
          {
            "text": "David.",
            "start": 270.74,
            "end": 273.94
          },
          {
            "text": "I",
            "start": 274.11,
            "end": 277.31
          },
          {
            "text": "want",
            "start": 277.47,
            "end": 280.67
          },
          {
            "text": "to",
            "start": 280.84,
            "end": 284.04
          },
          {
            "text": "expand",
            "start": 284.21,
            "end": 287.41
          },
          {
            "text": "beyond",
            "start": 287.58,
            "end": 290.78
          },
          {
            "text": "single-service",
            "start": 290.95,
            "end": 294.15
          },
          {
            "text": "implementation",
            "start": 294.32,
            "end": 297.52
          },
          {
            "text": "and",
            "start": 297.68,
            "end": 300.88
          },
          {
            "text": "lead",
            "start": 301.05,
            "end": 304.25
          },
          {
            "text": "architectural",
            "start": 304.42,
            "end": 307.62
          },
          {
            "text": "design",
            "start": 307.79,
            "end": 310.99
          },
          {
            "text": "across",
            "start": 311.16,
            "end": 314.36
          },
          {
            "text": "our",
            "start": 314.53,
            "end": 317.73
          },
          {
            "text": "core",
            "start": 317.89,
            "end": 321.09
          },
          {
            "text": "distributed",
            "start": 321.26,
            "end": 324.46
          },
          {
            "text": "infrastructure.",
            "start": 324.63,
            "end": 327.83
          }
        ]
      },
      {
        "id": "seg-4-007",
        "speakerId": "spk-m1",
        "start": 333,
        "end": 397,
        "text": "The biggest leap from Senior to Staff is organizational influence, technical strategy, and mentoring other engineers across teams.",
        "words": [
          {
            "text": "The",
            "start": 333,
            "end": 336.38
          },
          {
            "text": "biggest",
            "start": 336.56,
            "end": 339.93
          },
          {
            "text": "leap",
            "start": 340.11,
            "end": 343.49
          },
          {
            "text": "from",
            "start": 343.67,
            "end": 347.04
          },
          {
            "text": "Senior",
            "start": 347.22,
            "end": 350.6
          },
          {
            "text": "to",
            "start": 350.78,
            "end": 354.16
          },
          {
            "text": "Staff",
            "start": 354.33,
            "end": 357.71
          },
          {
            "text": "is",
            "start": 357.89,
            "end": 361.27
          },
          {
            "text": "organizational",
            "start": 361.44,
            "end": 364.82
          },
          {
            "text": "influence,",
            "start": 365,
            "end": 368.38
          },
          {
            "text": "technical",
            "start": 368.56,
            "end": 371.93
          },
          {
            "text": "strategy,",
            "start": 372.11,
            "end": 375.49
          },
          {
            "text": "and",
            "start": 375.67,
            "end": 379.04
          },
          {
            "text": "mentoring",
            "start": 379.22,
            "end": 382.6
          },
          {
            "text": "other",
            "start": 382.78,
            "end": 386.16
          },
          {
            "text": "engineers",
            "start": 386.33,
            "end": 389.71
          },
          {
            "text": "across",
            "start": 389.89,
            "end": 393.27
          },
          {
            "text": "teams.",
            "start": 393.44,
            "end": 396.82
          }
        ]
      },
      {
        "id": "seg-4-008",
        "speakerId": "spk-m2",
        "start": 402,
        "end": 465,
        "text": "That makes total sense. I would love to write our architecture proposal for the upcoming streaming websocket pipeline redesign.",
        "words": [
          {
            "text": "That",
            "start": 402,
            "end": 405.15
          },
          {
            "text": "makes",
            "start": 405.32,
            "end": 408.47
          },
          {
            "text": "total",
            "start": 408.63,
            "end": 411.78
          },
          {
            "text": "sense.",
            "start": 411.95,
            "end": 415.1
          },
          {
            "text": "I",
            "start": 415.26,
            "end": 418.41
          },
          {
            "text": "would",
            "start": 418.58,
            "end": 421.73
          },
          {
            "text": "love",
            "start": 421.89,
            "end": 425.04
          },
          {
            "text": "to",
            "start": 425.21,
            "end": 428.36
          },
          {
            "text": "write",
            "start": 428.53,
            "end": 431.68
          },
          {
            "text": "our",
            "start": 431.84,
            "end": 434.99
          },
          {
            "text": "architecture",
            "start": 435.16,
            "end": 438.31
          },
          {
            "text": "proposal",
            "start": 438.47,
            "end": 441.62
          },
          {
            "text": "for",
            "start": 441.79,
            "end": 444.94
          },
          {
            "text": "the",
            "start": 445.11,
            "end": 448.26
          },
          {
            "text": "upcoming",
            "start": 448.42,
            "end": 451.57
          },
          {
            "text": "streaming",
            "start": 451.74,
            "end": 454.89
          },
          {
            "text": "websocket",
            "start": 455.05,
            "end": 458.2
          },
          {
            "text": "pipeline",
            "start": 458.37,
            "end": 461.52
          },
          {
            "text": "redesign.",
            "start": 461.68,
            "end": 464.83
          }
        ]
      },
      {
        "id": "seg-4-009",
        "speakerId": "spk-m1",
        "start": 471,
        "end": 540,
        "text": "I think that would be the perfect flagship project to demonstrate Staff-level technical leadership. You would be setting patterns for all backend services.",
        "words": [
          {
            "text": "I",
            "start": 471,
            "end": 473.85
          },
          {
            "text": "think",
            "start": 474,
            "end": 476.85
          },
          {
            "text": "that",
            "start": 477,
            "end": 479.85
          },
          {
            "text": "would",
            "start": 480,
            "end": 482.85
          },
          {
            "text": "be",
            "start": 483,
            "end": 485.85
          },
          {
            "text": "the",
            "start": 486,
            "end": 488.85
          },
          {
            "text": "perfect",
            "start": 489,
            "end": 491.85
          },
          {
            "text": "flagship",
            "start": 492,
            "end": 494.85
          },
          {
            "text": "project",
            "start": 495,
            "end": 497.85
          },
          {
            "text": "to",
            "start": 498,
            "end": 500.85
          },
          {
            "text": "demonstrate",
            "start": 501,
            "end": 503.85
          },
          {
            "text": "Staff-level",
            "start": 504,
            "end": 506.85
          },
          {
            "text": "technical",
            "start": 507,
            "end": 509.85
          },
          {
            "text": "leadership.",
            "start": 510,
            "end": 512.85
          },
          {
            "text": "You",
            "start": 513,
            "end": 515.85
          },
          {
            "text": "would",
            "start": 516,
            "end": 518.85
          },
          {
            "text": "be",
            "start": 519,
            "end": 521.85
          },
          {
            "text": "setting",
            "start": 522,
            "end": 524.85
          },
          {
            "text": "patterns",
            "start": 525,
            "end": 527.85
          },
          {
            "text": "for",
            "start": 528,
            "end": 530.85
          },
          {
            "text": "all",
            "start": 531,
            "end": 533.85
          },
          {
            "text": "backend",
            "start": 534,
            "end": 536.85
          },
          {
            "text": "services.",
            "start": 537,
            "end": 539.85
          }
        ]
      },
      {
        "id": "seg-4-010",
        "speakerId": "spk-m1",
        "start": 545,
        "end": 614,
        "text": "I will also connect you with Alex Rivera as a Staff mentor to review your RFC drafts and guide you on cross-team consensus building.",
        "words": [
          {
            "text": "I",
            "start": 545,
            "end": 547.73
          },
          {
            "text": "will",
            "start": 547.88,
            "end": 550.61
          },
          {
            "text": "also",
            "start": 550.75,
            "end": 553.48
          },
          {
            "text": "connect",
            "start": 553.63,
            "end": 556.36
          },
          {
            "text": "you",
            "start": 556.5,
            "end": 559.23
          },
          {
            "text": "with",
            "start": 559.38,
            "end": 562.11
          },
          {
            "text": "Alex",
            "start": 562.25,
            "end": 564.98
          },
          {
            "text": "Rivera",
            "start": 565.13,
            "end": 567.86
          },
          {
            "text": "as",
            "start": 568,
            "end": 570.73
          },
          {
            "text": "a",
            "start": 570.88,
            "end": 573.61
          },
          {
            "text": "Staff",
            "start": 573.75,
            "end": 576.48
          },
          {
            "text": "mentor",
            "start": 576.63,
            "end": 579.36
          },
          {
            "text": "to",
            "start": 579.5,
            "end": 582.23
          },
          {
            "text": "review",
            "start": 582.38,
            "end": 585.11
          },
          {
            "text": "your",
            "start": 585.25,
            "end": 587.98
          },
          {
            "text": "RFC",
            "start": 588.13,
            "end": 590.86
          },
          {
            "text": "drafts",
            "start": 591,
            "end": 593.73
          },
          {
            "text": "and",
            "start": 593.88,
            "end": 596.61
          },
          {
            "text": "guide",
            "start": 596.75,
            "end": 599.48
          },
          {
            "text": "you",
            "start": 599.63,
            "end": 602.36
          },
          {
            "text": "on",
            "start": 602.5,
            "end": 605.23
          },
          {
            "text": "cross-team",
            "start": 605.38,
            "end": 608.11
          },
          {
            "text": "consensus",
            "start": 608.25,
            "end": 610.98
          },
          {
            "text": "building.",
            "start": 611.13,
            "end": 613.86
          }
        ]
      },
      {
        "id": "seg-4-011",
        "speakerId": "spk-m2",
        "start": 619,
        "end": 688,
        "text": "That would be invaluable David. Having Alex's feedback on multi-region failure modes will strengthen the proposal immensely.",
        "words": [
          {
            "text": "That",
            "start": 619,
            "end": 622.86
          },
          {
            "text": "would",
            "start": 623.06,
            "end": 626.91
          },
          {
            "text": "be",
            "start": 627.12,
            "end": 630.97
          },
          {
            "text": "invaluable",
            "start": 631.18,
            "end": 635.03
          },
          {
            "text": "David.",
            "start": 635.24,
            "end": 639.09
          },
          {
            "text": "Having",
            "start": 639.29,
            "end": 643.15
          },
          {
            "text": "Alex's",
            "start": 643.35,
            "end": 647.21
          },
          {
            "text": "feedback",
            "start": 647.41,
            "end": 651.27
          },
          {
            "text": "on",
            "start": 651.47,
            "end": 655.33
          },
          {
            "text": "multi-region",
            "start": 655.53,
            "end": 659.39
          },
          {
            "text": "failure",
            "start": 659.59,
            "end": 663.44
          },
          {
            "text": "modes",
            "start": 663.65,
            "end": 667.5
          },
          {
            "text": "will",
            "start": 667.71,
            "end": 671.56
          },
          {
            "text": "strengthen",
            "start": 671.76,
            "end": 675.62
          },
          {
            "text": "the",
            "start": 675.82,
            "end": 679.68
          },
          {
            "text": "proposal",
            "start": 679.88,
            "end": 683.74
          },
          {
            "text": "immensely.",
            "start": 683.94,
            "end": 687.8
          }
        ]
      },
      {
        "id": "seg-4-012",
        "speakerId": "spk-m1",
        "start": 693,
        "end": 762,
        "text": "Let's also look at opportunities for you to present at engineering all-hands and lead code review workshops for junior engineers.",
        "words": [
          {
            "text": "Let's",
            "start": 693,
            "end": 696.28
          },
          {
            "text": "also",
            "start": 696.45,
            "end": 699.73
          },
          {
            "text": "look",
            "start": 699.9,
            "end": 703.18
          },
          {
            "text": "at",
            "start": 703.35,
            "end": 706.63
          },
          {
            "text": "opportunities",
            "start": 706.8,
            "end": 710.08
          },
          {
            "text": "for",
            "start": 710.25,
            "end": 713.53
          },
          {
            "text": "you",
            "start": 713.7,
            "end": 716.98
          },
          {
            "text": "to",
            "start": 717.15,
            "end": 720.43
          },
          {
            "text": "present",
            "start": 720.6,
            "end": 723.88
          },
          {
            "text": "at",
            "start": 724.05,
            "end": 727.33
          },
          {
            "text": "engineering",
            "start": 727.5,
            "end": 730.78
          },
          {
            "text": "all-hands",
            "start": 730.95,
            "end": 734.23
          },
          {
            "text": "and",
            "start": 734.4,
            "end": 737.68
          },
          {
            "text": "lead",
            "start": 737.85,
            "end": 741.13
          },
          {
            "text": "code",
            "start": 741.3,
            "end": 744.58
          },
          {
            "text": "review",
            "start": 744.75,
            "end": 748.03
          },
          {
            "text": "workshops",
            "start": 748.2,
            "end": 751.48
          },
          {
            "text": "for",
            "start": 751.65,
            "end": 754.93
          },
          {
            "text": "junior",
            "start": 755.1,
            "end": 758.38
          },
          {
            "text": "engineers.",
            "start": 758.55,
            "end": 761.83
          }
        ]
      },
      {
        "id": "seg-4-013",
        "speakerId": "spk-m2",
        "start": 767,
        "end": 836,
        "text": "I would love to prepare a tech talk on backpressure handling in Node.js and Go for next month's engineering lunch-and-learn.",
        "words": [
          {
            "text": "I",
            "start": 767,
            "end": 770.28
          },
          {
            "text": "would",
            "start": 770.45,
            "end": 773.73
          },
          {
            "text": "love",
            "start": 773.9,
            "end": 777.18
          },
          {
            "text": "to",
            "start": 777.35,
            "end": 780.63
          },
          {
            "text": "prepare",
            "start": 780.8,
            "end": 784.08
          },
          {
            "text": "a",
            "start": 784.25,
            "end": 787.53
          },
          {
            "text": "tech",
            "start": 787.7,
            "end": 790.98
          },
          {
            "text": "talk",
            "start": 791.15,
            "end": 794.43
          },
          {
            "text": "on",
            "start": 794.6,
            "end": 797.88
          },
          {
            "text": "backpressure",
            "start": 798.05,
            "end": 801.33
          },
          {
            "text": "handling",
            "start": 801.5,
            "end": 804.78
          },
          {
            "text": "in",
            "start": 804.95,
            "end": 808.23
          },
          {
            "text": "Node.js",
            "start": 808.4,
            "end": 811.68
          },
          {
            "text": "and",
            "start": 811.85,
            "end": 815.13
          },
          {
            "text": "Go",
            "start": 815.3,
            "end": 818.58
          },
          {
            "text": "for",
            "start": 818.75,
            "end": 822.03
          },
          {
            "text": "next",
            "start": 822.2,
            "end": 825.48
          },
          {
            "text": "month's",
            "start": 825.65,
            "end": 828.93
          },
          {
            "text": "engineering",
            "start": 829.1,
            "end": 832.38
          },
          {
            "text": "lunch-and-learn.",
            "start": 832.55,
            "end": 835.83
          }
        ]
      },
      {
        "id": "seg-4-014",
        "speakerId": "spk-m1",
        "start": 841,
        "end": 900,
        "text": "Let's set up a quarterly milestone check-in to track progress against the Staff Engineer rubric ahead of the Q4 promotion cycle.",
        "words": [
          {
            "text": "Let's",
            "start": 841,
            "end": 843.67
          },
          {
            "text": "set",
            "start": 843.81,
            "end": 846.48
          },
          {
            "text": "up",
            "start": 846.62,
            "end": 849.29
          },
          {
            "text": "a",
            "start": 849.43,
            "end": 852.1
          },
          {
            "text": "quarterly",
            "start": 852.24,
            "end": 854.91
          },
          {
            "text": "milestone",
            "start": 855.05,
            "end": 857.72
          },
          {
            "text": "check-in",
            "start": 857.86,
            "end": 860.53
          },
          {
            "text": "to",
            "start": 860.67,
            "end": 863.34
          },
          {
            "text": "track",
            "start": 863.48,
            "end": 866.15
          },
          {
            "text": "progress",
            "start": 866.29,
            "end": 868.95
          },
          {
            "text": "against",
            "start": 869.1,
            "end": 871.76
          },
          {
            "text": "the",
            "start": 871.9,
            "end": 874.57
          },
          {
            "text": "Staff",
            "start": 874.71,
            "end": 877.38
          },
          {
            "text": "Engineer",
            "start": 877.52,
            "end": 880.19
          },
          {
            "text": "rubric",
            "start": 880.33,
            "end": 883
          },
          {
            "text": "ahead",
            "start": 883.14,
            "end": 885.81
          },
          {
            "text": "of",
            "start": 885.95,
            "end": 888.62
          },
          {
            "text": "the",
            "start": 888.76,
            "end": 891.43
          },
          {
            "text": "Q4",
            "start": 891.57,
            "end": 894.24
          },
          {
            "text": "promotion",
            "start": 894.38,
            "end": 897.05
          },
          {
            "text": "cycle.",
            "start": 897.19,
            "end": 899.86
          }
        ]
      }
    ],
    "highlights": [
      {
        "id": "hl-4-1",
        "meetingId": "meeting-4",
        "title": "Emily Expresses Staff Engineer Career Ambition",
        "start": 220,
        "end": 290,
        "category": "key_moment",
        "color": "#3B82F6",
        "createdAt": "2026-09-09T15:05:00.000Z"
      },
      {
        "id": "hl-4-2",
        "meetingId": "meeting-4",
        "title": "Flagship Streaming Architecture Project Assigned",
        "start": 430,
        "end": 500,
        "category": "decision",
        "color": "#8B5CF6",
        "createdAt": "2026-09-09T15:08:30.000Z"
      }
    ],
    "actionItems": [
      {
        "id": "act-4-1",
        "meetingId": "meeting-4",
        "meetingTitle": "Engineering Career Growth & Feedback",
        "text": "Write architecture proposal for streaming websocket pipeline redesign",
        "assigneeId": "spk-m2",
        "completed": false,
        "timestamp": 380,
        "priority": "high",
        "dueDate": "2026-09-23"
      },
      {
        "id": "act-4-2",
        "meetingId": "meeting-4",
        "meetingTitle": "Engineering Career Growth & Feedback",
        "text": "Connect Emily with Alex Rivera as Staff mentor for cross-team RFC reviews",
        "assigneeId": "spk-m1",
        "completed": true,
        "timestamp": 540,
        "priority": "medium",
        "dueDate": "2026-09-16"
      },
      {
        "id": "act-4-3",
        "meetingId": "meeting-4",
        "meetingTitle": "Engineering Career Growth & Feedback",
        "text": "Set up quarterly milestone check-in for Staff Engineer promotion track review",
        "assigneeId": "spk-m1",
        "completed": false,
        "timestamp": 820,
        "priority": "medium",
        "dueDate": "2026-09-30"
      }
    ],
    "summaries": {
      "executive": {
        "id": "executive",
        "name": "Executive Summary",
        "icon": "Briefcase",
        "overview": "Bi-weekly mentorship session between David Miller (Engineering Director) and Emily Watson (Senior Software Engineer). Reviewed Emily's successful production delivery of the websocket ingestion pipeline, which achieved zero errors and reduced p99 latency by 30%. Established career development milestones for Emily's promotion track to Staff Software Engineer, focusing on cross-team architectural leadership, RFC authoring, and mentoring.",
        "sections": [
          {
            "title": "Recent Delivery & Performance Feedback",
            "bullets": [
              "Websocket ingestion pipeline deployed to production with 100% stability and 30% reduction in p99 latency.",
              "Emily recognized for end-to-end ownership, distributed backpressure handling, and clean rollback mechanics."
            ],
            "timestampRefs": [
              {
                "text": "Ingestion pipeline metrics",
                "time": 38
              },
              {
                "text": "Engineering leadership recognition",
                "time": 84
              }
            ]
          },
          {
            "title": "Staff Engineer Career Roadmap",
            "bullets": [
              "Core competencies required for Staff promotion: organizational influence, cross-system architectural vision, and mentoring.",
              "Emily assigned flagship project: leading the architectural proposal for the company-wide streaming websocket pipeline redesign.",
              "Alex Rivera appointed as Staff mentor to provide guidance on multi-region failure modes and RFC reviews."
            ],
            "timestampRefs": [
              {
                "text": "Staff competency discussion",
                "time": 315
              },
              {
                "text": "Mentorship connection",
                "time": 515
              }
            ]
          },
          {
            "title": "Technical Sharing & Community Leadership",
            "bullets": [
              "Emily will lead an engineering lunch-and-learn tech talk on Node.js and Go backpressure patterns next month.",
              "Quarterly review milestone scheduled ahead of Q4 promotion committee deliberations."
            ],
            "timestampRefs": [
              {
                "text": "Tech talk proposal",
                "time": 725
              },
              {
                "text": "Quarterly milestone check-in",
                "time": 795
              }
            ]
          }
        ]
      },
      "action_items": {
        "id": "action_items",
        "name": "Action Items & Next Steps",
        "icon": "CheckSquare",
        "overview": "Career growth milestones and mentoring next steps agreed upon during the 1-on-1.",
        "sections": [
          {
            "title": "Technical Architecture & Mentoring",
            "bullets": [
              "Emily Watson: Write architecture proposal for streaming websocket pipeline redesign (Due: Sep 23).",
              "David Miller: Connect Emily with Alex Rivera as Staff mentor for cross-team RFC reviews (Due: Sep 16).",
              "David Miller: Set up quarterly milestone check-in for Staff Engineer promotion track review (Due: Sep 30)."
            ],
            "timestampRefs": [
              {
                "text": "Emily architecture proposal",
                "time": 380
              },
              {
                "text": "David mentor introduction",
                "time": 515
              },
              {
                "text": "Quarterly milestone review",
                "time": 795
              }
            ]
          }
        ]
      },
      "sales": {
        "id": "sales",
        "name": "Sales & Customer Impact",
        "icon": "TrendingUp",
        "overview": "Internal talent retention and engineering quality investments supporting reliable product delivery.",
        "sections": [
          {
            "title": "Platform Stability Dividends",
            "bullets": [
              "Emily's websocket optimizations directly improved live streaming transcript reliability for enterprise sales demonstrations."
            ],
            "timestampRefs": [
              {
                "text": "Latency improvement impact",
                "time": 38
              }
            ]
          }
        ]
      },
      "engineering": {
        "id": "engineering",
        "name": "Engineering & Architecture Notes",
        "icon": "Cpu",
        "overview": "Technical concepts discussed regarding streaming websocket pipelines and distributed backpressure.",
        "sections": [
          {
            "title": "Streaming Websocket Architecture",
            "bullets": [
              "High-throughput websocket multiplexing with adaptive sliding window backpressure.",
              "Distributed connection affinity managed through Redis pub/sub routing."
            ],
            "timestampRefs": [
              {
                "text": "Distributed backpressure handling",
                "time": 134
              }
            ]
          }
        ]
      }
    },
    "tags": [
      "1-on-1",
      "Mentorship",
      "Career",
      "Feedback",
      "Engineering"
    ]
  }
];
